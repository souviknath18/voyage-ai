from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.modules.auth.router import router as auth_router
from app.modules.trips.router import router as trips_router


router = APIRouter()


router.include_router(
  health_router,
  prefix="/health",
  tags=["Health"],
)


router.include_router(
  auth_router,
  prefix="/auth",
  tags=["Authentication"],
)


router.include_router(
    trips_router,
    prefix="/trips",
    tags=["Trips"],
)