from datetime import timedelta
from os import getenv


class Config:
    SECRET_KEY = getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = getenv("JWT_SECRET_KEY", "dev-jwt-secret-key")

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_ACCESS_COOKIE_PATH = "/"
    JWT_REFRESH_COOKIE_PATH = "/api/v1/auth/refresh"

    SQLALCHEMY_DATABASE_URI = getenv(
        "DATABASE_URL",
        "sqlite:///db.sqlite3"
    )

    CELERY = {
        "broker_url": getenv("CELERY_BROKER_URL"),
        "result_backend": getenv("CELERY_RESULT_BACKEND"),
        "task_ignore_result": True,
        "beat_schedule": {
            "enqueue-due-product-checks-every-5-minutes": {
                "task": "app.tasks.enqueue_due_product_checks_task",
                "schedule": 300.0,
            },
        },
        "timezone": "UTC",
    }