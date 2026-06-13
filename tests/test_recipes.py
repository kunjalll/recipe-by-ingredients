from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_create_and_get_recipe():
    payload = {
        "title": "Pancakes",
        "description": "Fluffy breakfast pancakes",
        "instructions": "Mix, cook, serve.",
        "prep_time_minutes": 10,
        "cook_time_minutes": 15,
        "servings": 4,
        "ingredients": [
            {"name": "flour", "quantity": "2", "unit": "cups"},
            {"name": "milk", "quantity": "1", "unit": "cup"},
        ],
    }

    create_response = client.post("/recipes", json=payload)
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["title"] == payload["title"]
    assert len(created["ingredients"]) == 2

    get_response = client.get(f"/recipes/{created['id']}")
    assert get_response.status_code == 200
    assert get_response.json()["title"] == payload["title"]

    list_response = client.get("/recipes")
    assert list_response.status_code == 200
    assert any(recipe["id"] == created["id"] for recipe in list_response.json())

    delete_response = client.delete(f"/recipes/{created['id']}")
    assert delete_response.status_code == 204
