
from datetime import date

import pytest

from app.modules.trips.lifecycle import get_trip_lifecycle


@pytest.mark.parametrize(
  "status,start_date,end_date,today,expected",
  [
    (
      "upcoming",
      date(2026, 10, 20),
      date(2026, 10, 25),
      date(2026, 10, 13),
      "upcoming",
    ),
    (
      "upcoming",
      date(2026, 10, 13),
      date(2026, 10, 20),
      date(2026, 10, 13),
      "in_progress",
    ),
    (
      "upcoming",
      date(2026, 10, 10),
      date(2026, 10, 13),
      date(2026, 10, 13),
      "in_progress",
    ),
    (
      "upcoming",
      date(2026, 10, 10),
      date(2026, 10, 12),
      date(2026, 10, 13),
      "completed",
    ),
    (
      "draft",
      date(2026, 10, 10),
      date(2026, 10, 20),
      date(2026, 10, 13),
      "draft",
    ),
    (
      "cancelled",
      date(2026, 10, 10),
      date(2026, 10, 20),
      date(2026, 10, 13),
      "cancelled",
    ),
    (
      "completed",
      date(2026, 10, 20),
      date(2026, 10, 25),
      date(2026, 10, 13),
      "completed",
    ),
    (
      "UPCOMING",
      date(2026, 10, 13),
      date(2026, 10, 13),
      date(2026, 10, 13),
      "in_progress",
    ),
  ],
)
def test_trip_lifecycle(
  status,
  start_date,
  end_date,
  today,
  expected,
):
  result = get_trip_lifecycle(
    status=status,
    start_date=start_date,
    end_date=end_date,
    today=today,
  )

  assert result == expected


def test_trip_lifecycle_does_not_modify_status():
  status = "upcoming"

  get_trip_lifecycle(
    status=status,
    start_date=date(2026, 10, 10),
    end_date=date(2026, 10, 12),
    today=date(2026, 10, 13),
  )

  assert status == "upcoming"