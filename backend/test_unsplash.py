import asyncio
import json

from app.integrations.images.service import (
  get_destination_image,
  get_place_image,
)


async def main():
  print(
    "\nDESTINATION IMAGE\n"
  )

  destination_image = (
    await get_destination_image(
      destination="Chennai",
      country="India",
    )
  )

  print(
    json.dumps(
      (
        destination_image.model_dump()
        if destination_image
        else None
      ),
      indent=2,
    )
  )

  print(
    "\nPLACE IMAGE\n"
  )

  place_image = (
    await get_place_image(
      place_name="Marina Beach",
      destination="Chennai",
      country="India",
    )
  )

  print(
    json.dumps(
      (
        place_image.model_dump()
        if place_image
        else None
      ),
      indent=2,
    )
  )


if __name__ == "__main__":
  asyncio.run(main())