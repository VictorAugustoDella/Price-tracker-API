from flask import request, jsonify
from app.routes.auth import auth_bp
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, set_access_cookies, set_refresh_cookies
from app.services.user_service import register_user_service, login_user_service

@auth_bp.route('/register', methods=['POST'])
def register_user():   
    data = request.get_json()
    
    user=register_user_service(data)
    
    return jsonify(user), 201

@auth_bp.route('/login', methods=['POST'])
def login_user():   
    data = request.get_json()

    user = login_user_service(data)
    
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    response = jsonify (
        access_token=access_token,
        refresh_token=refresh_token
    )
    
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    
    return response, 200
    
    
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=str(user_id))
    
    response = jsonify(access_token=access_token)
    
    set_access_cookies(response, access_token)
    
    return response, 200

