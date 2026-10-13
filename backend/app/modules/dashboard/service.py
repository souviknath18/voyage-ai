
import uuid

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.budgets.service import get_trip_budget
from app.modules.trips.lifecycle import get_trip_lifecycle

from app.modules.dashboard.repository import (
  get_dashboard_stats,
  get_dashboard_upcoming_trip,
  get_dashboard_recent_activity,
  get_dashboard_selected_flight,
  get_dashboard_selected_hotel,
)

from app.modules.dashboard.schemas import (
  DashboardStats,
  DashboardUpcomingTrip,
  DashboardRecentActivity,
  DashboardSummaryResponse,
)


async def get_dashboard_summary(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> DashboardSummaryResponse:
  """
  Build the authenticated user's dashboard summary.

  Includes:
  - Dashboard statistics
  - Upcoming or ongoing trip
  - Selected flight and hotel
  - Real budget utilization
  - Recent AI agent activity
  """

  # 1. Dashboard statistics
  stats_data = await get_dashboard_stats(
    db=db,
    user_id=user_id,
  )

  # 2. Upcoming or ongoing trip
  upcoming_trip_data = await get_dashboard_upcoming_trip(
    db=db,
    user_id=user_id,
  )

  # 3. Recent AI activity
  recent_activity_data = await get_dashboard_recent_activity(
    db=db,
    user_id=user_id,
    limit=5,
  )

  stats = DashboardStats(**stats_data)

  upcoming_trip = None

  if upcoming_trip_data is not None:
    trip = upcoming_trip_data

    # 4. Fetch the user's selected flight
    selected_flight = await get_dashboard_selected_flight(
      db=db,
      trip_id=trip.id,
      user_id=user_id,
    )

    # 5. Fetch the user's selected hotel
    selected_hotel = await get_dashboard_selected_hotel(
      db=db,
      trip_id=trip.id,
      user_id=user_id,
    )

    # 6. Reuse the existing budget service
    budget_summary = None

    try:
      budget_data = await get_trip_budget(
        db=db,
        public_trip_id=trip.trip_id,
        user_id=user_id,
      )

    except HTTPException as exc:
      # A trip may not have an itinerary yet.
      # Do not fail the whole Dashboard in that case.
      if (
        exc.status_code == 404
        and exc.detail == "Itinerary not found"
      ):
        budget_data = None
      else:
        raise

    if budget_data is not None:
      total_budget = budget_data.get("total_budget")
      estimated_cost = budget_data.get("estimated_cost")
      remaining_budget = budget_data.get("remaining_budget")
      utilization = budget_data.get(
        "utilization_percentage"
      )

      # Only return a complete budget summary.
      if (
        total_budget is not None
        and estimated_cost is not None
        and remaining_budget is not None
        and utilization is not None
      ):
        budget_summary = {
          "total_budget": total_budget,
          "estimated_cost": estimated_cost,
          "remaining_budget": remaining_budget,
          "utilization_percentage": utilization,
          "currency": budget_data["currency"],
        }

    # 7. Build upcoming trip with additional details
    upcoming_trip = DashboardUpcomingTrip.model_validate(
      {
        "trip_id": trip.trip_id,
        "origin": trip.origin,
        "destination": trip.destination,
        "destination_name": trip.destination_name,
        "destination_country": trip.destination_country,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "travelers": trip.travelers,
        "budget": trip.budget,
        "currency": trip.currency,
        "status": trip.status,
        "lifecycle": get_trip_lifecycle(
          status=trip.status,
          start_date=trip.start_date,
          end_date=trip.end_date,
        ),
        "is_saved": trip.is_saved,
        "selected_flight": selected_flight,
        "selected_hotel": selected_hotel,
        "budget_summary": budget_summary,
      }
    )

  # 8. Recent AI agent activity
  recent_activity = [
      DashboardRecentActivity.model_validate(activity)
      for activity in recent_activity_data
  ]

  # 9. Final response
  return DashboardSummaryResponse(
      stats=stats,
      upcoming_trip=upcoming_trip,
      recent_activity=recent_activity,
  )