from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.modules.auth.router import router as auth_router
from app.modules.trips.router import router as trips_router
from app.modules.trip_preferences.router import router as trip_preferences_router
from app.modules.agent_runs.router import router as agent_runs_router
from app.modules.itineraries.router import (
  router as itineraries_router,
)
from app.modules.locations.router import (
  router as locations_router,
)
from app.modules.weather.router import (
  router as weather_router,
)

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

router.include_router(
  trip_preferences_router,
  prefix="/trips",
  tags=["Trip Preferences"],
)

router.include_router(
  agent_runs_router,
  prefix="/trips",
  tags=["AI Planning"],
)

router.include_router(
  itineraries_router,
  prefix="/trips",
  tags=["Itineraries"],
)

router.include_router(
  locations_router,
  tags=["Locations"],
)

router.include_router(
  weather_router,
  tags=["Weather"],
)