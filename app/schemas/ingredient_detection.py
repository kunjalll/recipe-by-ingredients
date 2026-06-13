from pydantic import BaseModel, Field


class DetectedIngredient(BaseModel):
    name: str
    confidence: float | None = Field(default=None, ge=0, le=1)


class IngredientDetectionResult(BaseModel):
    ingredients: list[DetectedIngredient]
    notes: str | None = None


class GeminiIngredientResponse(BaseModel):
    ingredients: list[DetectedIngredient]
    notes: str | None = None
