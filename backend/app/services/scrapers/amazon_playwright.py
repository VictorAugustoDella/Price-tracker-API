import re

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

from app.exceptions import ValidationError



_GOTO_TIMEOUT = 20_000       
_JS_WIDGET_TIMEOUT = 10_000  
_ELEMENT_TIMEOUT = 8_000     
_DISMISS_TIMEOUT = 3_000     


_PRICE_WIDGET_SELECTOR = (
    ".priceToPay, "
    "#corePriceDisplay_desktop_feature_div, "
    "#apex_desktop"
)


_PRICE_SELECTOR_PAIRS = [
    # Most specific: the "price to pay" box (excludes crossed-out list price)
    (".priceToPay span.a-price-whole",                            ".priceToPay span.a-price-fraction"),
    # Core price display container — desktop layout
    ("#corePriceDisplay_desktop_feature_div span.a-price-whole",  "#corePriceDisplay_desktop_feature_div span.a-price-fraction"),
    # Apex widget — fallback for alternate page layouts
    ("#apex_desktop span.a-price-whole",                          "#apex_desktop span.a-price-fraction"),
]


_NAME_SELECTORS = [
    "#productTitle",
    "span.a-size-large.product-title-word-break",
]

_CAPTCHA_SIGNALS = ("captcha", "robot", "automated access", "verificação")



def _detect_invalid_page(page) -> None:
    title = page.title().lower()
    try:
        snippet = page.locator("body").inner_text(timeout=3_000)[:400].lower()
    except Exception:
        snippet = ""
    for signal in _CAPTCHA_SIGNALS:
        if signal in title or signal in snippet:
            raise ValidationError(
                "Amazon returned a verification/captcha page — scraping is blocked."
            )


def _get_text_or_none(locator) -> str | None:
    
    if locator.count() == 0:
        return None
    text = locator.first.inner_text(timeout=_ELEMENT_TIMEOUT).strip()
    return text or None


def _normalize_price(whole: str, fraction: str) -> str:
    
    whole = re.sub(r"\D", "", whole)
    fraction = re.sub(r"\D", "", fraction)

    if not whole:
        raise ValidationError(f"Could not parse price — whole part was empty after cleaning.")

    fraction = fraction if fraction else "00"
    return f"{whole},{fraction}"


def _extract_price(page) -> str:
    
    for whole_sel, frac_sel in _PRICE_SELECTOR_PAIRS:
        whole_text = _get_text_or_none(page.locator(whole_sel))
        if not whole_text:
            continue
        frac_text = _get_text_or_none(page.locator(frac_sel)) or "00"
        return _normalize_price(whole_text, frac_text)

    raise ValidationError(
        "Price not found — the product may be unavailable, out of stock, "
        "or the page layout has changed."
    )


def _extract_name(page) -> str:
    
    for selector in _NAME_SELECTORS:
        name = _get_text_or_none(page.locator(selector))
        if name:
            return name
    raise ValidationError(
        "Product name not found — the page structure may have changed."
    )




def amazon_scraper_price(
    link: str,
    include_name: bool = True
) -> tuple[str, str | None]:
    
    if not link.startswith(("http://", "https://")):
        link = f"https://{link}"

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        try:
            context = browser.new_context(
                locale="pt-BR",
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
            )
            page = context.new_page()

            try:
                page.goto(link, wait_until="domcontentloaded", timeout=_GOTO_TIMEOUT)
            except PlaywrightTimeoutError:
                raise ValidationError(
                    "Amazon page timed out while loading — the link may be invalid."
                )

            _detect_invalid_page(page)

            # Dismiss "Continue shopping" modal if present (best-effort)
            try:
                page.get_by_role("button", name="Continuar comprando").click(
                    timeout=_DISMISS_TIMEOUT
                )
            except PlaywrightTimeoutError:
                pass

        
            try:
                page.wait_for_selector(_PRICE_WIDGET_SELECTOR, timeout=_JS_WIDGET_TIMEOUT)
            except PlaywrightTimeoutError:
                raise ValidationError(
                    "Price widget did not render — the product may be unavailable "
                    "or the page took too long to load."
                )

            price = _extract_price(page)
            scraped_name = _extract_name(page) if include_name else None

            return price, scraped_name

        finally:
            browser.close()