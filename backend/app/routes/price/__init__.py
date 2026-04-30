from flask import Blueprint

price_bp = Blueprint('price', __name__, url_prefix='/api/v1')

from .....app.routes.price import price_routes