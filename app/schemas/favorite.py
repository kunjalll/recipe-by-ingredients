from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.recipe import RecipeRead


class FavoriteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    recipe: RecipeRead