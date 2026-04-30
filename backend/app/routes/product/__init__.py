from flask import Blueprint

product_bp = Blueprint('product', __name__, url_prefix='/api/v1')

from .....app.routes.product import product_routes