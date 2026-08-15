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