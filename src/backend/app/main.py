from contextlib import asynccontextmanager
from fastapi import FastAPI

from backend.app.api.router import api_router
from backend.app.core.setup_check import verify_setup
from backend.app.core.health import HealthTracker


health = HealthTracker()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Modern FastAPI lifecycle handler."""

    # --- Startup ---
    verify_setup()
    health.mark_healthy()

    yield  # Application runs here

    # --- Shutdown ---
    health.mark_unhealthy()


app = FastAPI(
    title="AutoCorrect Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Register API routes
app.include_router(api_router)
