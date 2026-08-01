from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.recipe import RecipeRead


class HistoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    action: str
    ingredients_used: str | None
    recipe: RecipeRead | None
    created_at: datetime