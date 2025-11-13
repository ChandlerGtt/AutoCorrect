from fastapi import APIRouter
from backend.app.core.setup_check import verify_setup

router = APIRouter()

@router.get("/")
def get_setup_status() -> dict:
    """Run setup check again on demand."""
    verify_setup()
    return {"status": "setup OK"}
