import { apiRequest } from "@/lib/api";
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
  data: CreateTripRequest
): Promise<Trip> {
  const token = localStorage.getItem(
    "access_token"
  );

  if (!token) {
    throw new Error("You are not logged in");
  }

  return apiRequest<Trip>(
    "/trips",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    }
  );
}

export async function getTrips(): Promise<Trip[]> {
  const token =
    localStorage.getItem(
      "access_token",
    );

  if (!token) {
    throw new Error(
      "You are not logged in",
    );
  }

  return apiRequest<Trip[]>(
    "/trips",
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );
}

export async function getTrip(
  tripId: string,
): Promise<Trip> {
  const token =
    localStorage.getItem("access_token");

  if (!token) {
    throw new Error(
      "You are not logged in",
    );
  }

  return apiRequest<Trip>(
    `/trips/${tripId}`,
    {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );
}

export async function updateTrip(
  tripId: string,
  data: UpdateTripRequest,
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
    `/trips/${tripId}`,
    {
      method: "PATCH",

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
  const token =
    localStorage.getItem(
      "access_token",
    );

  if (!token) {
    throw new Error(
      "You are not logged in",
    );
  }

  return apiRequest<TripPreference>(
    `/trips/${tripId}/preferences`,
    {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );
}


export async function saveTripPreferences(
  tripId: string,
  data: SaveTripPreferenceRequest,
): Promise<TripPreference> {
  const token =
    localStorage.getItem(
      "access_token",
    );

  if (!token) {
    throw new Error(
      "You are not logged in",
    );
  }

  return apiRequest<TripPreference>(
    `/trips/${tripId}/preferences`,
    {
      method: "PUT",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );
}

export async function planTrip(
  tripId: string,
): Promise<AgentRun> {
  const token =
    localStorage.getItem(
      "access_token",
    );

  if (!token) {
    throw new Error(
      "You are not logged in",
    );
  }

  return apiRequest<AgentRun>(
    `/trips/${tripId}/plan`,
    {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );
}

export async function getTripItinerary(
  tripId: string,
): Promise<TripItinerary> {
  const token =
    localStorage.getItem("access_token");

  if (!token) {
    throw new Error(
      "You are not logged in",
    );
  }

  return apiRequest<TripItinerary>(
    `/trips/${tripId}/itinerary`,
    {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );
}

export async function getTripPlaces(
  tripId: string,
): Promise<TripPlace[]> {
  const token =
    localStorage.getItem(
      "access_token",
    );

  if (!token) {
    throw new Error(
      "You are not logged in",
    );
  }

  return apiRequest<TripPlace[]>(
    `/trips/${tripId}/places`,
    {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );
}

export async function getTripWeather(
  tripId: string,
): Promise<TripWeather> {
  const token =
    localStorage.getItem(
      "access_token",
    );

  if (!token) {
    throw new Error(
      "You are not logged in",
    );
  }

  return apiRequest<TripWeather>(
    `/trips/${tripId}/weather`,
    {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );
}