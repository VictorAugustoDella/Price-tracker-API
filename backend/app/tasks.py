from celery import shared_task

from app.services.price_service import track_product_price_service


@shared_task
def track_product_price_task(product_id: int):
    track_product_price_service(product_id)