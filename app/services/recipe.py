from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.recipe import Recipe, RecipeIngredient
from app.schemas.recipe import RecipeCreate, RecipeUpdate


def list_recipes(db: Session) -> list[Recipe]:
    return db.query(Recipe).order_by(Recipe.id).all()


def get_recipe(db: Session, recipe_id: int) -> Recipe:
    recipe = db.get(Recipe, recipe_id)
    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )
    return recipe


def create_recipe(db: Session, data: RecipeCreate) -> Recipe:
    recipe = Recipe(
        title=data.title,
        description=data.description,
        instructions=data.instructions,
        prep_time_minutes=data.prep_time_minutes,
        cook_time_minutes=data.cook_time_minutes,
        servings=data.servings,
        ingredients=[
            RecipeIngredient(
                name=ingredient.name,
                quantity=ingredient.quantity,
                unit=ingredient.unit,
            )
            for ingredient in data.ingredients
        ],
    )
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe


def update_recipe(db: Session, recipe_id: int, data: RecipeUpdate) -> Recipe:
    recipe = get_recipe(db, recipe_id)
    updates = data.model_dump(exclude_unset=True)
    ingredients = updates.pop("ingredients", None)

    for field, value in updates.items():
        setattr(recipe, field, value)

    if ingredients is not None:
        recipe.ingredients.clear()
        recipe.ingredients.extend(
            RecipeIngredient(
                name=ingredient["name"],
                quantity=ingredient.get("quantity"),
                unit=ingredient.get("unit"),
            )
            for ingredient in ingredients
        )

    db.commit()
    db.refresh(recipe)
    return recipe


def delete_recipe(db: Session, recipe_id: int) -> None:
    recipe = get_recipe(db, recipe_id)
    db.delete(recipe)
    db.commit()
