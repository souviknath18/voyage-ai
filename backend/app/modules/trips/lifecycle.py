
from datetime import date, datetime, timezone
from typing import Literal


TripLifecycle = Literal[
  "draft",
  "upcoming",
  "in_progress",
  "completed",
  "cancelled",
]


def get_lifecycle_today() -> date:
  """
  Return the current UTC date.

  This is the shared date policy for
  AIX Voyage trip lifecycle calculations.
  """
  return datetime.now(timezone.utc).date()


def get_trip_lifecycle(
  *,
  status: str,
  start_date: date,
  end_date: date,
  today: date | None = None,
) -> TripLifecycle:
  """
  Derive trip lifecycle without changing
  its persisted database status.

  Dates are inclusive.

  The caller may supply 'today' for
  deterministic testing.
  """

  current_date = (
    today
    if today is not None
    else get_lifecycle_today()
  )

  normalized_status = status.strip().lower()

  if normalized_status == "cancelled":
    return "cancelled"

  if normalized_status == "completed":
    return "completed"

  if normalized_status == "draft":
    return "draft"

  if end_date < current_date:
    return "completed"

  if start_date <= current_date <= end_date:
    return "in_progress"

  return "upcoming"