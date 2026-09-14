from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
  async with engine.connect() as connection:
    await connection.execute(text("SELECT 1"))

  print("Database connection successful")

  yield

  await engine.dispose()