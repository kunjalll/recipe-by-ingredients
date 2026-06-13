from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_detect_ingredients_without_api_key():
    response = client.post(
        "/ingredients/detect",
        files={"image": ("food.jpg", b"fake-image", "image/jpeg")},
    )
    assert response.status_code == 503


def test_detect_ingredients_rejects_invalid_type():
    response = client.post(
        "/ingredients/detect",
        files={"image": ("food.txt", b"not-an-image", "text/plain")},
    )
    assert response.status_code == 400


@patch("app.services.ingredient_detection._get_client")
def test_detect_ingredients_success(mock_get_client):
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = (
        '{"ingredients": [{"name": "tomato", "confidence": 0.95}, '
        '{"name": "onion", "confidence": 0.88}], "notes": "Fresh produce"}'
    )
    mock_client.models.generate_content.return_value = mock_response
    mock_get_client.return_value = mock_client

    response = client.post(
        "/ingredients/detect",
        files={"image": ("food.jpg", b"fake-image", "image/jpeg")},
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data["ingredients"]) == 2
    assert data["ingredients"][0]["name"] == "tomato"
    assert data["notes"] == "Fresh produce"
    mock_client.models.generate_content.assert_called_once()
