from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user_optional, get_db
from app.models.user import User
from app.schemas.recipe import RecipeCreate, RecipeRead, RecipeUpdate
from app.services import history as history_service
from app.services import recipe as recipe_service

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("", response_model=list[RecipeRead])
def list_recipes(db: Session = Depends(get_db)):
    return recipe_service.list_recipes(db)


@router.get("/{recipe_id}", response_model=RecipeRead)
def get_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    recipe = recipe_service.get_recipe(db, recipe_id)
    if current_user is not None:
        history_service.log_view(db, current_user.id, recipe_id)
    return recipe


@router.post("", response_model=RecipeRead, status_code=status.HTTP_201_CREATED)
def create_recipe(data: RecipeCreate, db: Session = Depends(get_db)):
    return recipe_service.create_recipe(db, data)


@router.patch("/{recipe_id}", response_model=RecipeRead)
def update_recipe(
    recipe_id: int, data: RecipeUpdate, db: Session = Depends(get_db)
):
    return recipe_service.update_recipe(db, recipe_id, data)


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe_service.delete_recipe(db, recipe_id)