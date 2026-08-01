from sqlalchemy.orm import Session, joinedload

from app.models.history import SearchHistory


def log_search(db: Session, user_id: int, ingredients: list[str]) -> None:
    entry = SearchHistory(
        user_id=user_id,
        action="search",
        ingredients_used=", ".join(ingredients),
    )
    db.add(entry)
    db.commit()


def log_view(db: Session, user_id: int, recipe_id: int) -> None:
    entry = SearchHistory(
        user_id=user_id,
        action="view",
        recipe_id=recipe_id,
    )
    db.add(entry)
    db.commit()


def get_history(db: Session, user_id: int) -> list[SearchHistory]:
    return (
        db.query(SearchHistory)
        .options(joinedload(SearchHistory.recipe))
        .filter(SearchHistory.user_id == user_id)
        .order_by(SearchHistory.created_at.desc())
        .all()
    )