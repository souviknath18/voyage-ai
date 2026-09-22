import ssl

from sqlalchemy.ext.asyncio import (
  AsyncSession,
  async_sessionmaker,
  create_async_engine,
)

from app.core.config import settings


connect_args = {}

# Neon requires SSL
if "neon.tech" in settings.database_url:
  ssl_context = ssl.create_default_context()
  connect_args["ssl"] = ssl_context


engine = create_async_engine(
  settings.database_url,
  echo=False,
  pool_pre_ping=True,
  connect_args=connect_args,
)


AsyncSessionLocal = async_sessionmaker(
  bind=engine,
  class_=AsyncSession,
  expire_on_commit=False,
)