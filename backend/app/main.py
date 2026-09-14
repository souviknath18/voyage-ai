from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.lifespan import lifespan


app = FastAPI(
  title=settings.app_name,
  lifespan=lifespan,
)


app.include_router(api_router)


@app.get("/")
async def root():
  return {
    "message": "Welcome to VoyageAI API"
  }