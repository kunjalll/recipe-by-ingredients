from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlalchemy.orm import Session

from app.core.deps import get_current_user_optional, get_db
from app.models.user import User
from app.services import history as history_service
from app.services import ingredient_detection as detection_service
from app.services.matching import match_recipes

router = APIRouter(prefix="/match", tags=["matching"])


@router.get("")
def match_by_ingredients(
    ingredients: list[str] = Query(...),
    top_n: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """Match recipes by a list of ingredient names (text input)."""
    results = match_recipes(db, ingredients, top_n)

    if current_user is not None:
        history_service.log_search(db, current_user.id, ingredients)

    return _format_results(results)


@router.post("/from-image")
async def match_from_image(
    image: UploadFile = File(...),
    top_n: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """Upload an image → detect ingredients → return matching recipes."""

    image_bytes = await image.read()
    mime_type = image.content_type or "application/octet-stream"

    detection_result = detection_service.detect_ingredients(image_bytes, mime_type)
    ingredient_names = [ing.name for ing in detection_result.ingredients]

    if not ingredient_names:
        return {
            "detected_ingredients": [],
            "matches": [],
            "message": "No ingredients detected in the image",
        }

    results = match_recipes(db, ingredient_names, top_n)

    if current_user is not None:
        history_service.log_search(db, current_user.id, ingredient_names)

    return {
        "detected_ingredients": ingredient_names,
        "matches": _format_results(results),
    }


def _format_results(results: list) -> list:
    return [
        {
            "id": r["recipe"].id,
            "title": r["recipe"].title,
            "description": r["recipe"].description,
            "instructions": r["recipe"].instructions,
            "score": r["score"],
            "tfidf_score": r["tfidf_score"],
            "coverage_score": r["coverage_score"],
            "match_count": r["match_count"],
            "total_ingredients": r["total_ingredients"],
            "matched_ingredients": r["matched_ingredients"],
        }
        for r in results
    ]