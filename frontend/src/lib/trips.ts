import {
  apiBlobRequest,
  apiRequest,
} from "@/lib/api";
import type { TravelPace } from "@/types/trip";

export interface CreateTripRequest {
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  budget?: number;
  currency: string;
}

export interface Trip {
  id: string;
  trip_id: string;
  user_id: string;
  origin: string;
  destination: string;

  origin_name: string | null;
  origin_country: string | null;
  origin_country_code: string | null;
  origin_latitude: string | null;
  origin_longitude: string | null;
  origin_timezone: string | null;

  destination_name: string | null;
  destination_country: string | null;
  destination_country_code: string | null;
  destination_latitude: string | null;
  destination_longitude: string | null;
  destination_timezone: string | null;

  start_date: string;
  end_date: string;
  travelers: number;
  budget: string | null;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateTripRequest {
  origin?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  travelers?: number;
  budget?: number;
  currency?: string;
}

export interface TripDestinationRequest {
  name: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface TripOriginRequest {
  name: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface TripPreference {
  id: string;
  trip_id: string;
  pace: TravelPace;
  interests: string[];
  ai_brief: string | null;
  budget_level: number;
  created_at: string;
  updated_at: string;
}

export interface SaveTripPreferenceRequest {
  pace: TravelPace;
  interests: string[];
  ai_brief: string | null;
  budget_level: number;
}

export interface AgentRun {
  id: string;
  trip_id: string;
  status: "pending" | "running" | "completed" | "failed";
  current_step: string | null;
  attempt: number;
  input_snapshot: Record<string, unknown> | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ToolCallActivity {
  id: string;
  tool_name: string;
  status: "pending" | "running" | "completed" | "failed";
  attempt: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface AgentStepActivity {
  id: string;
  step_name: string;
  status: "pending" | "running" | "completed" | "failed";
  attempt: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  tool_calls: ToolCallActivity[];
}

export interface AgentRunActivity {
  id: string;
  trip_id: string;
  status: "pending" | "running" | "completed" | "failed";
  current_step: string | null;
  attempt: number;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  steps: AgentStepActivity[];
}

export type ItineraryGroundingType =
  | "verified_place"
  | "generic";

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string | null;
  activity_type: ItineraryGroundingType;
  cost_category: BudgetCategory;
  place_id: string | null;
  estimated_cost: string;
}

export interface ItineraryDay {
  id: string;
  day_number: number;
  date: string;
  title: string;
  activities: ItineraryItem[];
}

export interface TripItinerary {
  id: string;
  trip_id: string;
  agent_run_id: string;
  destination: string;
  summary: string;
  currency: string;
  estimated_total_cost: string;
  days: ItineraryDay[];
  created_at: string;
  updated_at: string;
}

export type BudgetCategory =
  | "food"
  | "transport"
  | "activity"
  | "shopping"
  | "other";

export interface TripBudgetCategory {
  category: BudgetCategory;
  estimated_cost: string;
  percentage: number;
}

export interface TripBudget {
  trip_id: string;
  currency: string;
  total_budget: string | null;
  estimated_cost: string;
  remaining_budget: string | null;
  utilization_percentage: number | null;
  status:
    | "within_budget"
    | "over_budget"
    | "no_budget";
  categories: TripBudgetCategory[];
}

export interface TripPlace {
  id: string;
  provider: string;
  provider_place_id: string;
  name: string;
  categories: string[];
  address: string | null;
  latitude: string;
  longitude: string;
  distance: string | null;
  search_group: string | null;
  created_at: string;
}

export interface WeatherDay {
  date: string;
  temperature_max: number | null;
  temperature_min: number | null;
  precipitation_probability: number | null;
  weather_code: number | null;
  weather_description: string;
}

export interface TripWeather {
  destination: string;
  country: string | null;
  timezone: string | null;
  source: string;
  forecast_available_until: string | null;
  forecast: WeatherDay[];
}

export async function createTrip(
  data: CreateTripRequest,
): Promise<Trip> {
  return apiRequest<Trip>(
    "/trips",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function getTrips(): Promise<Trip[]> {
  return apiRequest<Trip[]>(
    "/trips",
    {
      method: "GET",
    },
  );
}

export async function getTrip(
  tripId: string,
): Promise<Trip> {
  return apiRequest<Trip>(
    `/trips/${tripId}`,
    {
      method: "GET",
    },
  );
}

export async function getTripBudget(
  tripId: string,
): Promise<TripBudget> {
  return apiRequest<TripBudget>(
    `/trips/${tripId}/budget`,
    {
      method: "GET",
    },
  );
}

export async function updateTrip(
  tripId: string,
  data: UpdateTripRequest,
): Promise<Trip> {
  return apiRequest<Trip>(
    `/trips/${tripId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

export async function setTripDestination(
  tripId: string,
  data: TripDestinationRequest,
): Promise<Trip> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("You are not logged in");
  }

  return apiRequest<Trip>(
    `/trips/${tripId}/destination`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );
}

export async function setTripOrigin(
  tripId: string,
  data: TripOriginRequest,
): Promise<Trip> {
  const token =
    localStorage.getItem(
      "access_token",
    );

  if (!token) {
    throw new Error(
      "You are not logged in",
    );
  }

  return apiRequest<Trip>(
    `/trips/${tripId}/origin`,
    {
      method: "PUT",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(
        data,
      ),
    },
  );
}

export async function getTripPreferences(
  tripId: string,
): Promise<TripPreference> {
  return apiRequest<TripPreference>(
    `/trips/${tripId}/preferences`,
    {
      method: "GET",
    },
  );
}


export async function saveTripPreferences(
  tripId: string,
  data: SaveTripPreferenceRequest,
): Promise<TripPreference> {
  return apiRequest<TripPreference>(
    `/trips/${tripId}/preferences`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export async function planTrip(
  tripId: string,
): Promise<AgentRun> {
  return apiRequest<AgentRun>(
    `/trips/${tripId}/plan`,
    {
      method: "POST",
    },
  );
}

export async function getAgentRun(
  agentRunId: string,
): Promise<AgentRun> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("You are not logged in");
  }

  return apiRequest<AgentRun>(
    `/trips/agent-runs/${agentRunId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getAgentRunActivity(
  agentRunId: string,
): Promise<AgentRunActivity> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("You are not logged in");
  }

  return apiRequest<AgentRunActivity>(
    `/trips/agent-runs/${agentRunId}/activity`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

export async function getTripItinerary(
  tripId: string,
): Promise<TripItinerary> {
  return apiRequest<TripItinerary>(
    `/trips/${tripId}/itinerary`,
    {
      method: "GET",
    },
  );
}

export async function getTripPlaces(
  tripId: string,
): Promise<TripPlace[]> {
  return apiRequest<TripPlace[]>(
    `/trips/${tripId}/places`,
    {
      method: "GET",
    },
  );
}

export async function getTripWeather(
  tripId: string,
): Promise<TripWeather> {
  return apiRequest<TripWeather>(
    `/trips/${tripId}/weather`,
    {
      method: "GET",
    },
  );
}

export async function getTripMapPreview(
  tripId: string,
  dayNumber: number,
): Promise<Blob> {
  return apiBlobRequest(
    `/trips/${tripId}/map-preview?day=${dayNumber}`,
    {
      method: "GET",
    },
  );
}