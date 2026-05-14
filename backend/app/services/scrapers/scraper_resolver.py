from urllib.parse import urlparse

from app.exceptions import ValidationError
from app.services.scrapers.amazon_playwright import amazon_scraper_price
from app.services.scrapers.mercado_livre_playwright import ml_scraper_price



_AMAZON_HOSTS = {"amazon.com.br"}
_ML_HOSTS = {"mercadolivre.com.br", "mercadolibre.com.br"}


def _is_known_host(hostname: str, known: set[str]) -> bool:

    return any(
        hostname == host or hostname.endswith(f".{host}") for host in known
    )




def get_scraper(url: str):
    
    if "://" not in url:
        url = f"https://{url}"

    hostname = urlparse(url).hostname
    if not hostname:
        raise ValidationError("Invalid url")

    hostname = hostname.lower()

    if _is_known_host(hostname, _AMAZON_HOSTS):
        return amazon_scraper_price, "amazon"

    if _is_known_host(hostname, _ML_HOSTS):
        return ml_scraper_price, "mercadolivre"

    raise ValidationError("link must be a amazon or mercadolivre link")