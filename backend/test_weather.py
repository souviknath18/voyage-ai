import asyncio
import json

from app.ai.tools.weather import get_weather


async def main():
    result = await get_weather(
        destination="Chennai",
        latitude=13.08784,
        longitude=80.27847,
        timezone="Asia/Kolkata",
        start_date="2026-09-24",
        end_date="2026-09-28",
    )

    print(
        json.dumps(
            result,
            indent=2,
        )
    )


if __name__ == "__main__":
    asyncio.run(main())