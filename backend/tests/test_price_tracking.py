from datetime import UTC, datetime, timedelta
from decimal import Decimal

from app.db import db
from app.models.price_history_model import PriceHistory
from app.services.price_service import (
    get_due_product_ids_service,
    track_product_price_service,
)
import app.services.price_service as price_service


def test_get_due_product_ids_service_returns_due_product(product):
    product_obj, _ = product

    product_obj.next_check_at = datetime.now(UTC) - timedelta(minutes=1)
    db.session.commit()

    due_product_ids = get_due_product_ids_service()

    assert product_obj.id in due_product_ids


def test_track_product_price_service_does_not_save_same_price(product, monkeypatch):
    product_obj, _ = product

    def fake_scraper(url):
        return Decimal("43.50"), "Produto Mockado"

    def fake_get_scraper(url):
        return fake_scraper, "amazon"

    monkeypatch.setattr(price_service, "get_scraper", fake_get_scraper)

    prices_before = PriceHistory.query.filter_by(
        product_id=product_obj.id
    ).count()

    result = track_product_price_service(product_obj.id)

    prices_after = PriceHistory.query.filter_by(
        product_id=product_obj.id
    ).count()

    assert result is None
    assert prices_after == prices_before
    assert product_obj.last_checked_at is not None