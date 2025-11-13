from fastapi import APIRouter
from backend.app.core.health import health_tracker

router = APIRouter()

@router.get("/")
def get_health() -> dict:
    """Returns backend health status."""
    return health_tracker.status()
