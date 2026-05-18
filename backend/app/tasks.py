from celery import shared_task

from app.services.price_service import (
    get_due_product_ids_service,
    track_product_price_service,
)


@shared_task
def track_product_price_task(product_id: int):
    track_product_price_service(product_id)


@shared_task
def enqueue_due_product_checks_task():
    due_product_ids = get_due_product_ids_service()

    for product_id in due_product_ids:
        track_product_price_task.delay(product_id)