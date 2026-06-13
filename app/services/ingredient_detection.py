from fastapi import HTTPException, status
from google import genai
from google.genai import types

from app.core.config import get_google_api_key, settings
from app.schemas.ingredient_detection import (
    GeminiIngredientResponse,
    IngredientDetectionResult,
)

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
}
MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024

DETECTION_PROMPT = (
    "Identify all food ingredients visible in this image. "
    "Return common ingredient names in lowercase singular form "
    "(for example: tomato, onion, garlic). "
    "Include raw ingredients only, not prepared dishes or brand names. "
    "If no food ingredients are visible, return an empty ingredients list."
)


def _get_client() -> genai.Client:
    api_key = get_google_api_key()
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google API key is not configured",
        )
    return genai.Client(api_key=api_key)


def detect_ingredients(image_bytes: bytes, mime_type: str) -> IngredientDetectionResult:
    if mime_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image type: {mime_type}",
        )

    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must be 20MB or smaller",
        )

    client = _get_client()
    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
            DETECTION_PROMPT,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeminiIngredientResponse,
        ),
    )

    if not response.text:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Google API returned an empty response",
        )

    try:
        parsed = GeminiIngredientResponse.model_validate_json(response.text)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to parse Google API response",
        ) from exc

    return IngredientDetectionResult(
        ingredients=parsed.ingredients,
        notes=parsed.notes,
    )
