
import { apiRequest } from "@/lib/api";

export interface DashboardStats {
  total_trips: number;
  countries_planned: number;
  saved_places: number;
}

export interface DashboardSelectedFlight {
  airline: string;
  airline_code: string | null;
  price: string;
  currency: string;
  selected_at: string;
}

export interface DashboardSelectedHotel {
  hotel_name: string;
  price: string;
  currency: string;
  selected_at: string;
}

export interface DashboardBudgetSummary {
  total_budget: string;
  estimated_cost: string;
  remaining_budget: string;
  utilization_percentage: number;
  currency: string;
}

export type TripLifecycle =
  | "draft"
  | "upcoming"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface DashboardUpcomingTrip {
  trip_id: string;
  origin: string;
  destination: string;
  destination_name: string | null;
  destination_country: string | null;
  start_date: string;
  end_date: string;
  travelers: number;
  budget: string | null;
  currency: string;
  status: string;
  lifecycle: TripLifecycle | null;
  is_saved: boolean;

  selected_flight: DashboardSelectedFlight | null;
  selected_hotel: DashboardSelectedHotel | null;
  budget_summary: DashboardBudgetSummary | null;
}

export interface DashboardRecentActivity {
  agent_run_id: string;
  trip_id: string;
  destination: string;
  status: string;
  current_step: string | null;
  created_at: string;
}

export interface DashboardSummary {
  stats: DashboardStats;
  upcoming_trip: DashboardUpcomingTrip | null;
  recent_activity: DashboardRecentActivity[];
}

/**
 * Fetch the authenticated user's dashboard summary.
 *
 * Reuses the existing API client for:
 * - Bearer token authentication
 * - Automatic token refresh
 * - API error handling
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>(
    "/dashboard/summary",
    {
      method: "GET",
    },
  );
}
