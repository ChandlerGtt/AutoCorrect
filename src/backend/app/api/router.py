from fastapi import APIRouter
from fastapi.responses import JSONResponse

from .endpoints import health, setup

api_router = APIRouter()

@api_router.get("/")
def root() -> JSONResponse:
    return JSONResponse({"message": "AutoCorrect Backend Running"})

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(setup.router, prefix="/setup", tags=["Setup"])
