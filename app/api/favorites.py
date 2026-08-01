from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.favorite import FavoriteRead
from app.services import favorite as favorite_service

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=list[FavoriteRead])
def list_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return favorite_service.list_favorites(db, current_user.id)


@router.post("/{recipe_id}", response_model=FavoriteRead, status_code=status.HTTP_201_CREATED)
def add_favorite(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return favorite_service.add_favorite(db, current_user.id, recipe_id)


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorite_service.remove_favorite(db, current_user.id, recipe_id)