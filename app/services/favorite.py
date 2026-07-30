from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.favorite import Favorite
from app.services.recipe import get_recipe


def list_favorites(db: Session, user_id: int) -> list[Favorite]:
    return (
        db.query(Favorite)
        .options(joinedload(Favorite.recipe))
        .filter(Favorite.user_id == user_id)
        .order_by(Favorite.created_at.desc())
        .all()
    )


def add_favorite(db: Session, user_id: int, recipe_id: int) -> Favorite:
    get_recipe(db, recipe_id)  # raises 404 if the recipe doesn't exist

    existing = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id, Favorite.recipe_id == recipe_id)
        .first()
    )
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recipe already in favorites",
        )

    favorite = Favorite(user_id=user_id, recipe_id=recipe_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite


def remove_favorite(db: Session, user_id: int, recipe_id: int) -> None:
    favorite = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id, Favorite.recipe_id == recipe_id)
        .first()
    )
    if favorite is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found",
        )
    db.delete(favorite)
    db.commit()