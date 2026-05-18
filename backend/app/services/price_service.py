from app.models.product_model import Product
from app.models.price_history_model import PriceHistory
from app.db import db
from app.exceptions import NotFoundError
from app.validators.price_validators import validate_price_fields
from app.services.price_stats import calculate_stats
from app.validators.price_validators import validate_scraped_price
from app.services.scrapers.scraper_resolver import get_scraper
from datetime import UTC, datetime, timedelta


def view_product_prices_by_id_service(user_id: int, id: int):
    product = Product.query.filter_by(id=id, user_id=user_id).first()
    
    if not product:
        raise NotFoundError("product not found")
    
    prices = PriceHistory.query.filter_by(product_id=id).order_by(
        PriceHistory.collected_at.desc()
    ).all()
    
    return prices


def view_product_prices_stats_by_id_service(user_id: int, product_id: int, fields: str):
    validated_fields = validate_price_fields(fields)

    product = Product.query.filter_by(user_id=user_id, id=product_id).first()

    if not product:
        raise NotFoundError("product not found")

    prices_query = db.session.query(PriceHistory).filter_by(product_id=product_id)

    if not prices_query.first():
        raise NotFoundError("price not found")

    stats = calculate_stats(prices_query, validated_fields)

    return stats


def _scrape_validated_price(product: Product):
    product_url = product.url

    scraper, _ = get_scraper(product_url)
    price, _ = scraper(product_url)

    return validate_scraped_price(price)


def refresh_product_price_by_id_service(user_id: int, id: int):
    product = Product.query.filter_by(id=id, user_id=user_id).first()
    
    if not product:
        raise NotFoundError("product not found")

    price = _scrape_validated_price(product)
    
    product_price = PriceHistory(product_id=product.id, price=price)
    
    db.session.add(product_price)
    db.session.commit()
    
    return product_price


def track_product_price_service(product_id: int):
    product = db.session.get(Product, product_id)

    if not product:
        return None

    price = _scrape_validated_price(product)
    
    checked_at = datetime.now(UTC)

    product.last_checked_at = checked_at
    product.next_check_at = checked_at + timedelta(hours=1)

    last_price = PriceHistory.query.filter_by(
        product_id=product.id
    ).order_by(
        PriceHistory.collected_at.desc()
    ).first()

    if last_price and last_price.price == price:
        db.session.commit()
        return None

    product_price = PriceHistory(
        product_id=product.id,
        price=price
    )

    db.session.add(product_price)
    db.session.commit()
    

def get_due_product_ids_service():
    now = datetime.now(UTC)

    due_products = Product.query.filter(
        Product.next_check_at <= now
    ).all()

    return [product.id for product in due_products]