from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from werkzeug.exceptions import HTTPException

from app.celery_app import celery_init_app
from app.config.settings import Config
from app.db import db
from app.exceptions import (
    ConflictError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
)

# Mantêm os models carregados para migrations/Alembic enxergarem as tabelas
from app.models.price_history_model import PriceHistory
from app.models.product_model import Product
from app.models.user_model import User

from app.routes.auth import auth_bp
from app.routes.price import price_bp
from app.routes.product import product_bp


migrate = Migrate()


def create_app(database_uri=None):
    app = Flask(__name__)

    app.config.from_object(Config)

    if database_uri:
        app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5173"}},
        allow_headers=["Content-Type", "Authorization", "X-CSRF-TOKEN"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        supports_credentials=True,
    )

    db.init_app(app)
    migrate.init_app(app, db)

    JWTManager(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(price_bp)

    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return jsonify({"error": str(e)}), 400

    @app.errorhandler(UnauthorizedError)
    def handle_unauthorized_error(e):
        return jsonify({"error": str(e)}), 401

    @app.errorhandler(NotFoundError)
    def handle_not_found_error(e):
        return jsonify({"error": str(e)}), 404

    @app.errorhandler(ConflictError)
    def handle_conflict_error(e):
        return jsonify({"error": str(e)}), 409

    @app.errorhandler(Exception)
    def handle_internal_error(e):
        if isinstance(e, HTTPException):
            return e

        app.logger.exception("Unhandled exception: %s", e)
        return jsonify({"error": "Internal server error"}), 500

    celery_init_app(app)

    return app