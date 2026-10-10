from collections import defaultdict
from datetime import datetime
from typing import Any


def detect_itinerary_conflicts(
  days: list[dict[str, Any]],
) -> list[str]:
  warnings: list[str] = []

  # 1. Detect duplicate start times
  for day in days:
    activities_by_time = defaultdict(list)

    for activity in day.get("activities", []):
      time_value = activity.get("time", "")

      try:
        parsed_time = datetime.strptime(
          time_value.strip().upper(),
          "%I:%M %p",
        )
      except (ValueError, AttributeError):
        continue

      time_key = parsed_time.strftime("%H:%M")

      activities_by_time[time_key].append(
        activity.get("title", "Unknown activity")
      )

    for time_key, titles in activities_by_time.items():
      if len(titles) < 2:
        continue

      formatted_time = datetime.strptime(
        time_key, "%H:%M"
      ).strftime("%I:%M %p").lstrip("0")

      warnings.append(
        f"Day {day.get('day_number')}: "
        f"{len(titles)} activities are scheduled "
        f"at {formatted_time}: "
        + ", ".join(titles)
        + "."
      )

  # 2. Detect overlapping activity durations
  for day in days:
    scheduled = []

    for activity in day.get("activities", []):
      duration = activity.get("duration_minutes")

      if (
        not isinstance(duration, int)
        or isinstance(duration, bool)
        or duration <= 0
      ):
        continue

      try:
        start = datetime.strptime(
          activity.get("time", "").strip().upper(),
          "%I:%M %p",
        )
      except (ValueError, AttributeError):
        continue

      start_minutes = start.hour * 60 + start.minute

      scheduled.append({
        "title": activity.get("title", "Unknown activity"),
        "start": start_minutes,
        "end": start_minutes + duration,
      })

    scheduled.sort(key=lambda item: item["start"])

    for index, first in enumerate(scheduled):
      for second in scheduled[index + 1:]:
        if second["start"] >= first["end"]:
          break

        if second["start"] == first["start"]:
          # Already covered by duplicate-start detection.
          continue

        overlap_minutes = (
          min(first["end"], second["end"])
          - second["start"]
        )

        warnings.append(
          f"Day {day.get('day_number')}: "
          f"'{first['title']}' overlaps with "
          f"'{second['title']}' by "
          f"{overlap_minutes} minutes."
        )

  return warnings