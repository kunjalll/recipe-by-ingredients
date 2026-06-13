from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RecipeIngredientBase(BaseModel):
    name: str = Field(max_length=255)
    quantity: str | None = Field(default=None, max_length=50)
    unit: str | None = Field(default=None, max_length=50)


class RecipeIngredientCreate(RecipeIngredientBase):
    pass


class RecipeIngredientRead(RecipeIngredientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int


class RecipeBase(BaseModel):
    title: str = Field(max_length=255)
    description: str | None = None
    instructions: str
    prep_time_minutes: int | None = Field(default=None, ge=0)
    cook_time_minutes: int | None = Field(default=None, ge=0)
    servings: int | None = Field(default=None, ge=1)


class RecipeCreate(RecipeBase):
    ingredients: list[RecipeIngredientCreate] = Field(default_factory=list)


class RecipeUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    description: str | None = None
    instructions: str | None = None
    prep_time_minutes: int | None = Field(default=None, ge=0)
    cook_time_minutes: int | None = Field(default=None, ge=0)
    servings: int | None = Field(default=None, ge=1)
    ingredients: list[RecipeIngredientCreate] | None = None


class RecipeRead(RecipeBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    ingredients: list[RecipeIngredientRead]
