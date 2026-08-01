from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.history import HistoryRead
from app.services import history as history_service

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[HistoryRead])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return history_service.get_history(db, current_user.id)