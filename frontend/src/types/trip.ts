import type {
  LocationSuggestion,
} from "@/types/location";

export type TravelPace =
  | "relaxed"
  | "balanced"
  | "packed";

export interface TripFormData {
  origin: string;
  destination: string;

  originLocation: LocationSuggestion | null;
  destinationLocation: LocationSuggestion | null;

  startDate: string;
  endDate: string;

  travelers: number;

  currency: string;
  budget: number;
  budgetLevel: number;

  pace: TravelPace;
  interests: string[];

  aiBrief: string;
}

export interface Trip {
  id: string;
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