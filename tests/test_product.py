def test_products_requires_auth(client):
    response = client.get("/api/v1/products")

    assert response.status_code == 401
    
def test_create_product_success(client, auth_header):
    response = client.post(
        "/api/v1/products",
        headers=auth_header,
        json={
            "product": "Mouse Gamer",
            "url": "https://www.amazon.com.br/BlenderBottle-SportMixer-Tritan-Shaker-Bottle/dp/B07GCMM2RR/"
        }
    )

    data = response.get_json()

    assert response.status_code == 201
    assert {"product", "id", "added_at", "last_change"}.issubset(data)
    
def test_create_product_missing_field(client, auth_header):
    response = client.post(
        "/api/v1/products",
        headers=auth_header,
        json={
            "product": "Mouse Gamer",
        }
    )
    
    data = response.get_json()

    assert response.status_code == 400
    assert ("Product url is required") in data['error']

def test_create_product_invalid_url(client, auth_header):
    response = client.post(
        "/api/v1/products",
        headers=auth_header,
        json={
            "product": "Mouse Gamer",
            "url": "amazoncombr"
        }
    )
    
    data = response.get_json()
    
    assert response.status_code == 400
    assert "Invalid url" in data['error']
    


    
def test_view_products(client, auth_header, product):
    response = client.get("/api/v1/products", headers=auth_header)
    
    data = response.get_json()
    
    assert response.status_code == 200
    assert len(data) == 1
    
def test_view_products_by_id(client, auth_header, product):
    response = client.get("/api/v1/products/1", headers=auth_header)
    
    data = response.get_json()
    
    assert response.status_code == 200
    assert len(data) == 7 #rota devolve 7 objetos serializados no to_dict()
    
def test_get_product_not_found(client, auth_header, product):
    response = client.get("/api/v1/products/2", headers=auth_header)

    data = response.get_json()

    assert response.status_code == 404
    assert "product not found" in data['error']
    
    
    

def test_update_product_success(client, auth_header, product):
    response = client.put(
        "/api/v1/products/1",
        headers=auth_header,
        json={
            "product": "Butter"
        })
    
    data = response.get_json()

    assert response.status_code == 200
    assert "Butter" in data['product']
    
    
    
    
def test_delete_product_success(client, auth_header, product):
    response = client.delete(
        "/api/v1/products/1",
        headers=auth_header
    )
    

    assert response.status_code == 204