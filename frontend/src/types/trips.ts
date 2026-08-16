export type TravelPace =
  | "relaxed"
  | "balanced"
  | "packed";

export interface TripFormData {
  origin: string;
  destination: string;
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

/* ===================================
   My Trips
=================================== */

export type TripStatus =
  | "upcoming"
  | "draft"
  | "completed"
  | "saved";

export type TripTab =
  | "upcoming"
  | "draft"
  | "completed"
  | "saved";

export interface TripListItem {
  id: string;

  title: string;

  origin: string;
  destination: string;

  startDate?: string;
  endDate?: string;

  duration: number;

  travelers: number;

  currency: string;
  estimatedCost?: number;

  image: string;

  status: TripStatus;

  saved?: boolean;
}