import asyncio

from sqlalchemy import text

from app.db.session import engine


async def test_db():
  async with engine.connect() as connection:
    result = await connection.execute(
      text("SELECT 1")
    )

    print("Database connected:", result.scalar())

  await engine.dispose()


asyncio.run(test_db())