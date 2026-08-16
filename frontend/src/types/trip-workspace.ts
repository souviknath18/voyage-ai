export type TripWorkspaceTab =
  | "overview"
  | "itinerary"
  | "budget"
  | "places"
  | "map"
  | "activity";

export interface TripFlight {
  id: string;
  type: "departure" | "return";

  airline: string;
  flightNumber: string;

  from: string;
  to: string;

  departureTime: string;

  route: string;

  cabin: string;

  price: number;
}

export interface TripHotel {
  id: string;

  name: string;
  room: string;

  address: string;

  image?: string;

  rating: number;

  pricePerNight: number;

  nights: number;
}

export interface TripWeather {
  temperature: number;

  condition: string;

  note: string;
}

export interface TripBudgetItem {
  label: string;
  amount: number;
}

export interface TripWorkspaceData {
  id: string;

  title: string;

  origin: string;
  destination: string;

  originCode?: string;
  destinationCode?: string;

  startDate: string;
  endDate: string;

  duration: number;

  travelers: number;

  status: "ready" | "planning" | "warning";

  currency: string;

  totalBudget: number;
  estimatedCost: number;
  remainingBudget: number;

  image?: string;

  aiSummary: string;

  warning?: {
    title: string;
    description: string;
  };

  flights: TripFlight[];

  hotel: TripHotel;

  weather: TripWeather;

  highlights: string[];

  budgetBreakdown: TripBudgetItem[];

  itinerary: ItineraryDayData[];

  budgetCategories: TripBudgetCategory[];

  budgetInsight: string;

  budgetRecommendations: BudgetRecommendation[];

  potentialSavings: number;

  places: TripPlace[];

  placeAlternatives: TripPlaceAlternative[];

  mapDays: TripMapDay[];

  agentRun: AgentRunData;

  flightOptions: FlightComparisonOption[];

  hotelOptions: HotelComparisonOption[];

  placeDetails: PlaceDetailsData[];
}

export type ItineraryActivityType =
  | "transport"
  | "hotel"
  | "food"
  | "attraction"
  | "shopping"
  | "nature"
  | "experience";

export interface ItineraryActivity {
  id: string;

  title: string;
  description: string;

  type: ItineraryActivityType;

  startTime: string;
  duration: string;

  location?: string;

  estimatedCost?: number;

  image?: string;

  booked?: boolean;
}

export interface ItineraryDayData {
  id: string;

  dayNumber: number;

  title: string;

  date: string;

  estimatedCost: number;

  weather: {
    temperature: number;
    condition: string;
  };

  activities: ItineraryActivity[];
}

export type BudgetSource =
  | "live"
  | "estimated";

export interface TripBudgetCategory {
  id: string;

  label: string;

  amount: number;

  source: BudgetSource;

  type:
    | "flight"
    | "hotel"
    | "food"
    | "transport"
    | "activities"
    | "shopping"
    | "buffer";
}

export interface BudgetRecommendation {
  id: string;

  title: string;

  description: string;

  savings: number;

  type:
    | "flight"
    | "hotel"
    | "food"
    | "transport"
    | "activity";
}

export type TripPlaceCategory =
  | "attraction"
  | "food"
  | "culture"
  | "technology"
  | "shopping"
  | "nature";

export type TripPlaceStatus =
  | "planned"
  | "saved"
  | "optional";

export type TripPlaceFilter =
  | "all"
  | TripPlaceCategory
  | "saved";

export interface TripPlace {
  id: string;

  name: string;
  category: TripPlaceCategory;

  location: string;
  description: string;

  image?: string;

  visitDuration: string;

  estimatedCost: number;

  rating?: number;

  itineraryDay?: number;

  status: TripPlaceStatus;

  saved: boolean;

  recommended?: boolean;

  recommendationReason?: string;
}

export interface TripPlaceAlternative {
  id: string;

  name: string;

  description: string;

  image?: string;

  benefit:
    | "interest"
    | "cost"
    | "travel"
    | "crowds";

  savings?: number;

  replacingPlaceId?: string;
}

export interface TripMapLocation {
  id: string;

  name: string;

  subtitle?: string;

  dayNumber: number;

  time: string;

  type:
    | "attraction"
    | "food"
    | "hotel"
    | "transport"
    | "shopping"
    | "experience";

  image?: string;

  latitude?: number;
  longitude?: number;

  mapX: number;
  mapY: number;

  duration?: string;

  estimatedCost?: number;

  transportToNext?: {
    mode:
      | "walk"
      | "train"
      | "car"
      | "bus";
    duration: string;
  };
}

export interface TripMapDay {
  dayNumber: number;

  date: string;

  title: string;

  locations: TripMapLocation[];
}

export type AgentActivityStatus =
  | "completed"
  | "running"
  | "warning"
  | "failed"
  | "queued";

export type AgentActivityType =
  | "request"
  | "flight"
  | "hotel"
  | "budget"
  | "places"
  | "weather"
  | "itinerary"
  | "validation"
  | "optimization";

export interface AgentActivityEvent {
  id: string;

  title: string;

  description: string;

  status: AgentActivityStatus;

  type: AgentActivityType;

  duration?: string;

  provider?: string;

  result?: string;

  timestamp?: string;
}

export interface AgentRunData {
  id: string;

  title: string;

  status:
    | "running"
    | "completed"
    | "failed";

  startedAt: string;

  elapsedTime: string;

  completedSteps: number;

  totalSteps: number;

  events: AgentActivityEvent[];
}

export type OptimizationPreset =
  | "cheaper"
  | "comfortable"
  | "less-busy"
  | "more-activities"
  | "local-experiences"
  | "better-food"
  | "less-travel"
  | "family-friendly";

export interface FlightComparisonOption {
  id: string;

  airline: string;
  flightNumber: string;

  from: string;
  to: string;

  departureTime: string;
  arrivalTime: string;

  duration: string;

  stops: number;

  stopDescription?: string;

  cabin: string;

  baggage?: string;

  wifi?: boolean;

  price: number;

  label?:
    | "recommended"
    | "cheapest"
    | "fastest";

  current?: boolean;
}

export interface HotelComparisonOption {
  id: string;

  name: string;

  room: string;

  location: string;

  address?: string;

  image?: string;

  rating: number;

  pricePerNight: number;

  nights: number;

  amenities: string[];

  highlights: string[];

  label?:
    | "recommended"
    | "best-value"
    | "closest";

  current?: boolean;
}

export interface NearbyPlace {
  id: string;

  name: string;

  distance: string;

  image?: string;
}

export interface PlaceDetailsData {
  id: string;

  name: string;

  category: string;

  location: string;

  image?: string;

  rating: number;

  description: string;

  duration: string;

  openingHours: string;

  bestTime: string;

  estimatedCost: number;

  currency: string;

  status:
    | "planned"
    | "saved"
    | "not-planned";

  saved: boolean;

  itineraryDay?: number;

  aiInsight?: {
    type:
      | "budget"
      | "schedule"
      | "recommendation";

    title: string;

    description: string;
  };

  nearby: NearbyPlace[];
}