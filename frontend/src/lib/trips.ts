import { apiRequest } from "@/lib/api";

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
  user_id: string;
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  budget: number | null;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
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