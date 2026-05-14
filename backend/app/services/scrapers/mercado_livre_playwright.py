import json
import re
from decimal import Decimal, InvalidOperation

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

from app.exceptions import ValidationError




_GOTO_TIMEOUT = 20_000
_ELEMENT_TIMEOUT = 8_000



_NAME_SELECTORS = [
    "h1.ui-pdp-title",
    "span.ui-pdp-title",
]

_INVALID_PAGE_SIGNALS = (
    "robot",
    "captcha",
    "acesso negado",
    "página não encontrada",
    "verifique que você é humano",
)




def _detect_invalid_page(page) -> None:
    
    title = page.title().lower()

    try:
        body_preview = page.locator("body").inner_text(timeout=_ELEMENT_TIMEOUT).lower()[:2500]
    except PlaywrightTimeoutError:
        body_preview = ""

    searchable_content = f"{title}\n{body_preview}"

    for signal in _INVALID_PAGE_SIGNALS:
        if signal in searchable_content:
            raise ValidationError(
                "Mercado Livre returned an unexpected or blocked page."
            )


def _get_visible_text_or_none(page, selector: str) -> str | None:
    
    locator = page.locator(selector).first

    try:
        locator.wait_for(state="visible", timeout=_ELEMENT_TIMEOUT)
        text = locator.inner_text(timeout=_ELEMENT_TIMEOUT).strip()
        return text or None
    except PlaywrightTimeoutError:
        return None


def _safe_locator_text_or_none(locator) -> str | None:
    
    if locator.count() == 0:
        return None

    try:
        text = locator.first.inner_text(timeout=_ELEMENT_TIMEOUT).strip()
        return text or None
    except PlaywrightTimeoutError:
        return None


def _normalize_price(raw: str) -> str:
    
    if not raw or not raw.strip():
        raise ValidationError("Unexpected empty price format.")

    cleaned = re.sub(r"[^\d,.]", "", raw.strip())

    if not cleaned:
        raise ValidationError(f"Unexpected price format: '{raw}'")

    # PT-BR format: 1.999,90 -> 1999.90
    if "," in cleaned:
        cleaned = cleaned.replace(".", "").replace(",", ".")

    
    elif cleaned.count(".") > 1:
        parts = cleaned.split(".")

        if len(parts[-1]) == 2:
            cleaned = "".join(parts[:-1]) + "." + parts[-1]
        else:
            cleaned = "".join(parts)

    try:
        value = Decimal(cleaned).quantize(Decimal("0.01"))
    except InvalidOperation:
        raise ValidationError(f"Unexpected price format: '{raw}'")

    whole, fraction = f"{value:.2f}".split(".")
    return f"{whole},{fraction}"


def _walk_json(node):
    
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from _walk_json(value)

    elif isinstance(node, list):
        for item in node:
            yield from _walk_json(item)


# ---------------------------------------------------------------------------
# Price extraction strategies
# ---------------------------------------------------------------------------

def _price_from_json_ld(page) -> str | None:
    
    scripts = page.locator('script[type="application/ld+json"]')

    for i in range(scripts.count()):
        try:
            raw_json = scripts.nth(i).inner_text(timeout=3_000).strip()

            if not raw_json:
                continue

            data = json.loads(raw_json)

        except Exception:
            continue

        prioritized_candidates = []
        fallback_candidates = []

        for node in _walk_json(data):
            if not isinstance(node, dict):
                continue

            price = node.get("price")

            if price is None:
                continue

            try:
                normalized = _normalize_price(str(price))
            except ValidationError:
                continue

            node_type = node.get("@type")

            if isinstance(node_type, list):
                node_types = {str(item).lower() for item in node_type}
            else:
                node_types = {str(node_type).lower()}

            if "offer" in node_types:
                prioritized_candidates.append(normalized)
            else:
                fallback_candidates.append(normalized)

        if prioritized_candidates:
            return prioritized_candidates[0]

        if fallback_candidates:
            return fallback_candidates[0]

    return None


def _price_from_meta(page) -> str | None:
    
    meta = page.locator('meta[itemprop="price"]')

    if meta.count() == 0:
        return None

    content = meta.first.get_attribute("content")

    if not content or not content.strip():
        return None

    try:
        return _normalize_price(content)
    except ValidationError:
        return None


def _price_from_main_price_dom(page) -> str | None:
    
    price_blocks = page.locator(".ui-pdp-price__second-line")

    for i in range(price_blocks.count()):
        block = price_blocks.nth(i)

        whole = _safe_locator_text_or_none(
            block.locator(".andes-money-amount__fraction")
        )

        cents = _safe_locator_text_or_none(
            block.locator(".andes-money-amount__cents")
        )

        if whole:
            raw_price = f"{whole},{cents or '00'}"

            try:
                return _normalize_price(raw_price)
            except ValidationError:
                pass

       
        block_text = _safe_locator_text_or_none(block)

        if block_text:
            match = re.search(r"R\$\s*([\d.]+(?:,\d{2})?)", block_text)

            if match:
                try:
                    return _normalize_price(match.group(1))
                except ValidationError:
                    pass

    return None


def _price_from_text_near_title(page, scraped_name: str) -> str | None:
    
    try:
        body_text = page.locator("body").inner_text(timeout=_ELEMENT_TIMEOUT)
    except PlaywrightTimeoutError:
        return None

    if not body_text:
        return None

    title_index = body_text.find(scraped_name)

    if title_index == -1:
        return None

    nearby_text = body_text[title_index:title_index + 1200]

    stop_markers = [
        "Ver os meios de pagamento",
        "O que você precisa saber",
        "Opções de compra:",
        "Ir para a compra",
    ]

    stop_positions = [
        nearby_text.find(marker)
        for marker in stop_markers
        if nearby_text.find(marker) != -1
    ]

    if stop_positions:
        nearby_text = nearby_text[:min(stop_positions)]

    candidate_prices = []

    for line in nearby_text.splitlines():
        normalized_line = line.strip().lower()

        if not normalized_line:
            continue

        
        if "preço por" in normalized_line:
            continue

        if "por mês" in normalized_line:
            continue

        if re.search(r"\d+x\s*r\$", normalized_line):
            continue

        matches = re.findall(r"R\$\s*([\d.]+(?:,\d{2})?)", line)

        for raw_price in matches:
            try:
                candidate_prices.append(_normalize_price(raw_price))
            except ValidationError:
                continue

    if not candidate_prices:
        return None

    
    return candidate_prices[-1]


def _extract_price(page, scraped_name: str) -> str:
    
    strategies = [
        lambda: _price_from_json_ld(page),
        lambda: _price_from_meta(page),
        lambda: _price_from_main_price_dom(page),
        lambda: _price_from_text_near_title(page, scraped_name),
    ]

    for strategy in strategies:
        price = strategy()

        if price:
            return price

    raise ValidationError(
        "Price not found — Mercado Livre may have returned an unsupported, blocked, or unexpected product page."
    )


def _extract_name(page) -> str:

    for selector in _NAME_SELECTORS:
        name = _get_visible_text_or_none(page, selector)

        if name:
            return name

    raise ValidationError(
        "Product name not found — Mercado Livre may have returned an unexpected page."
    )




def ml_scraper_price(link: str) -> tuple[str, str]:
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
                page.goto(
                    link,
                    wait_until="domcontentloaded",
                    timeout=_GOTO_TIMEOUT,
                )
            except PlaywrightTimeoutError:
                raise ValidationError(
                    "Mercado Livre page timed out while loading."
                )

            _detect_invalid_page(page)

            scraped_name = _extract_name(page)
            price = _extract_price(page, scraped_name)

            return price, scraped_name

        finally:
            browser.close()