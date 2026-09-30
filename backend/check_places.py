import asyncio
from pprint import pprint

from app.ai.tools.places import search_places


async def main():
    result = await search_places(
      latitude=-8.33333,
      longitude=115.0,
      interests=[
        "food",
        "nature",
      ],
      limit=30,
    )

    pprint(result)


if __name__ == "__main__":
    asyncio.run(main())