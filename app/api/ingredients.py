from fastapi import APIRouter, File, UploadFile

from app.schemas.ingredient_detection import IngredientDetectionResult
from app.services import ingredient_detection as ingredient_detection_service

router = APIRouter(prefix="/ingredients", tags=["ingredients"])


@router.post("/detect", response_model=IngredientDetectionResult)
async def detect_ingredients(image: UploadFile = File(...)):
    image_bytes = await image.read()
    mime_type = image.content_type or "application/octet-stream"
    return ingredient_detection_service.detect_ingredients(image_bytes, mime_type)
