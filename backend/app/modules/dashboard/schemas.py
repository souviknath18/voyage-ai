
from datetime import date, datetime
from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class DashboardStats(BaseModel):
  total_trips: int = Field(default=0, ge=0)
  countries_planned: int = Field(default=0, ge=0)
  saved_places: int = Field(default=0, ge=0)


class DashboardSelectedFlight(BaseModel):
  airline: str
  airline_code: str | None = None
  price: Decimal = Field(ge=0)
  currency: str
  selected_at: datetime


class DashboardSelectedHotel(BaseModel):
  hotel_name: str
  price: Decimal = Field(ge=0)
  currency: str
  selected_at: datetime


class DashboardBudgetSummary(BaseModel):
  total_budget: Decimal = Field(ge=0)
  estimated_cost: Decimal = Field(ge=0)
  remaining_budget: Decimal
  utilization_percentage: float = Field(ge=0)
  currency: str


class DashboardUpcomingTrip(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  trip_id: str
  origin: str
  destination: str

  destination_name: str | None = None
  destination_country: str | None = None

  start_date: date
  end_date: date

  travelers: int
  budget: Decimal | None = None
  currency: str

  status: str
  is_saved: bool

  # Optional real flight selection
  selected_flight: DashboardSelectedFlight | None = None

  # Optional real hotel selection
  selected_hotel: DashboardSelectedHotel | None = None

  # Optional calculated budget summary
  budget_summary: DashboardBudgetSummary | None = None

  lifecycle: Literal[
    "draft",
    "upcoming",
    "in_progress",
    "completed",
    "cancelled",
  ] | None = None


class DashboardRecentActivity(BaseModel):
  agent_run_id: str
  trip_id: str
  destination: str
  status: str
  current_step: str | None = None
  created_at: datetime


class DashboardSummaryResponse(BaseModel):
  stats: DashboardStats
  upcoming_trip: DashboardUpcomingTrip | None = None
  recent_activity: list[DashboardRecentActivity] = Field(
    default_factory=list
  )