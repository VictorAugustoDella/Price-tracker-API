from flask import Flask, jsonify, request
from app.db import db
from app.routes.auth import auth_bp
from app.routes.product import product_bp
from app.routes.price import price_bp
from os import getenv
from flask_jwt_extended import JWTManager
from app.models.user_model import User
from app.models.product_model import Product
from app.models.price_history_model import PriceHistory
from app.exceptions import ValidationError, NotFoundError, ConflictError, UnauthorizedError
from flask_migrate import Migrate
from werkzeug.exceptions import HTTPException
from flask_cors import CORS
from datetime import timedelta

migrate = Migrate()

def create_app(database_uri=None):
    app = Flask(__name__)
    
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5173"}},
        allow_headers=["Content-Type", "Authorization", "X-CSRF-TOKEN"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        supports_credentials=True
    )
    
    app.config['SECRET_KEY'] = getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = getenv('JWT_SECRET_KEY', 'dev-jwt-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
    app.config['JWT_COOKIE_SECURE'] = False
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/api/v1/auth/refresh'
    app.config['SQLALCHEMY_DATABASE_URI'] = database_uri or getenv('DATABASE_URL', 'sqlite:///db.sqlite3')
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    JWTManager(app)
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(price_bp)
    
    # Handlers de erro
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
    
    return app