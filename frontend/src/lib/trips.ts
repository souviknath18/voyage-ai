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