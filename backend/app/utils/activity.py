from functools import wraps
from flask_jwt_extended import get_jwt_identity

from app.services.user_service import update_last_access


def track_user_activity(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()

        if user_id:
            update_last_access(int(user_id))

        return fn(*args, **kwargs)

    return wrapper