import asyncio
import json

from app.ai.tools.weather import get_weather


async def main():
    result = await get_weather(
        destination="Bali",
        start_date="2026-09-18",
        end_date="2026-09-24",
    )

    print(
        json.dumps(
            result,
            indent=2,
        )
    )


if __name__ == "__main__":
    asyncio.run(main())