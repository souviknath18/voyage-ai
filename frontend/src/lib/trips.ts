import {
  apiBlobRequest,
  apiRequest,
} from "@/lib/api";
import type { TravelPace } from "@/types/trip";
import type {
  TripAssistantResponse,
  TripChangeProposal,
} from "@/types/trip-assistant";

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
  is_saved: boolean;
  created_at: string;
  updated_at: string;

  estimated_total_cost: string | null;
  itinerary_version: number | null;
  itinerary_id: string | null;
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

export type TripOptimizationType =
  | "cheaper"
  | "less_busy"
  | "more_activities"
  | "more_comfortable"
  | "custom";

export interface OptimizeTripRequest {
  optimization_type: TripOptimizationType;
  instructions: string | null;
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
  version: number;
}

export interface ItineraryVersion {
  id: string;
  agent_run_id: string;
  version: number;
  destination: string;
  summary: string;
  currency: string;
  estimated_total_cost: string;
  created_at: string;
}

export type BudgetCategory =
  | "food"
  | "transport"
  | "activity"
  | "shopping"
  | "accommodation"
  | "flight"
  | "other";

export interface TripBudgetCategory {
  category: BudgetCategory;
  estimated_cost: string;
  percentage: number;
}

export interface BudgetPotentialSavings {
  amount: string;
  percentage: number;
}

export interface BudgetInsight {
  title: string;
  description: string;
}

export interface BudgetRecommendationResponse {
  title: string;
  description: string;
  category: BudgetCategory;
  estimated_savings: string;
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

  potential_savings: BudgetPotentialSavings;

  insight: BudgetInsight;

  recommendations:
    BudgetRecommendationResponse[];
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

export interface FlightSegment {
  airline: string;
  airline_code: string | null;
  flight_number: string;

  origin: string;
  destination: string;

  departure_at: string;
  arrival_at: string;

  duration: string | null;
  cabin: string | null;
}

export interface FlightSlice {
  origin: string;
  destination: string;

  departure_at: string;
  arrival_at: string;

  duration: string;

  stops: number;
  stop_description: string;

  segments: FlightSegment[];
}

export interface FlightOffer {
  id: string;

  airline: string;
  airline_code: string | null;

  outbound: FlightSlice;
  return_flight: FlightSlice | null;

  baggage: string | null;
  wifi: boolean | null;

  price: string;
  currency: string;

  converted_price: string;
  converted_currency: string;
  exchange_rate: string;

  expires_at: string | null;
}

export interface TripFlightsResponse {
  trip_id: string;

  origin: string;
  destination: string;

  origin_code: string;
  destination_code: string;

  travelers: number;
  start_date: string;
  end_date: string;

  currency: string;

  offers: FlightOffer[];
}

export interface SelectedFlightResponse {
  id: string;
  trip_id: string;

  provider: string;
  provider_offer_id: string;

  airline: string;
  airline_code: string | null;

  original_price: string;
  original_currency: string;

  converted_price: string;
  converted_currency: string;
  exchange_rate: string;

  outbound: FlightSlice;
  return_flight: FlightSlice | null;

  baggage: string | null;
  expires_at: string | null;

  selected_at: string;
  updated_at: string;
}


export interface HotelRoom {
  id: string;
  name: string;
  description: string | null;
  bed_type: string | null;
  board_type: string | null;
  refundable: boolean | null;
  cancellation_policy: string | null;
}

export interface HotelOffer {
  id: string;
  hotel_id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  star_rating: number | null;
  image_url: string | null;
  amenities: string[];
  room: HotelRoom;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: string;
  currency: string;
  price_per_night: string;
  converted_price: string;
  converted_price_per_night: string;
  converted_currency: string;
  exchange_rate: string;
  rank: number;
  ranking_score: number;
  within_hotel_budget: boolean | null;
}

export interface TripHotelsResponse {
  trip_id: string;
  destination: string;
  travelers: number;
  check_in: string;
  check_out: string;
  currency: string;
  hotel_budget: string | null;
  recommended_hotel_id: string | null;
  offers: HotelOffer[];
}

export interface SelectedHotelResponse {
  id: string;
  trip_id: string;
  provider: string;
  provider_offer_id: string;
  hotel_id: string;
  hotel_name: string;
  original_price: string;
  original_currency: string;
  converted_price: string;
  converted_currency: string;
  exchange_rate: string;
  hotel_snapshot: HotelOffer;
  selected_at: string;
  updated_at: string;
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

export async function optimizeTrip(
  tripId: string,
  data: OptimizeTripRequest,
): Promise<AgentRun> {
  return apiRequest<AgentRun>(
    `/trips/${tripId}/optimize`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function sendTripAssistantMessage(
  tripId: string,
  message: string,
  activeProposal?: TripChangeProposal | null,
): Promise<TripAssistantResponse> {
  return apiRequest<TripAssistantResponse>(
    `/trips/${tripId}/assistant/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        active_proposal:
          activeProposal ?? null,
      }),
    },
  );
}

export async function applyTripAssistantProposal(
  tripId: string,
  proposal: TripChangeProposal,
): Promise<AgentRun> {
  return apiRequest<AgentRun>(
    `/trips/${tripId}/assistant/apply`,
    {
      method: "POST",
      body: JSON.stringify({
        proposal,
      }),
    },
  );
}

export async function getAgentRun(
  agentRunId: string,
): Promise<AgentRun> {
  return apiRequest<AgentRun>(
    `/trips/agent-runs/${agentRunId}`,
    {
      method: "GET",
    },
  );
}

export async function getAgentRunActivity(
  agentRunId: string,
): Promise<AgentRunActivity> {
  return apiRequest<AgentRunActivity>(
    `/trips/agent-runs/${agentRunId}/activity`,
    {
      method: "GET",
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

export async function getTripItineraryVersions(
  tripId: string,
): Promise<ItineraryVersion[]> {
  return apiRequest<ItineraryVersion[]>(
    `/trips/${tripId}/itineraries`,
    {
      method: "GET",
    },
  );
}


export async function getTripItineraryVersion(
  tripId: string,
  version: number,
): Promise<TripItinerary> {
  return apiRequest<TripItinerary>(
    `/trips/${tripId}/itineraries/${version}`,
    {
      method: "GET",
    },
  );
}


export async function restoreTripItineraryVersion(
  tripId: string,
  version: number,
): Promise<TripItinerary> {
  return apiRequest<TripItinerary>(
    `/trips/${tripId}/itineraries/${version}/restore`,
    {
      method: "POST",
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

export async function updateTripSavedStatus(
  tripId: string,
  isSaved: boolean,
): Promise<Trip> {
  return apiRequest<Trip>(
    `/trips/${tripId}/saved`,
    {
      method: "PATCH",
      body: JSON.stringify({
        is_saved: isSaved,
      }),
    },
  );
}


export async function getTripFlights(
  tripId: string,
): Promise<TripFlightsResponse> {
  return apiRequest<TripFlightsResponse>(
    `/trips/${tripId}/flights`,
    {
      method: "GET",
    },
  );
}


export async function getSelectedTripFlight(
  tripId: string,
): Promise<SelectedFlightResponse | null> {
  return apiRequest<SelectedFlightResponse | null>(
    `/trips/${tripId}/flights/selected`,
    {
      method: "GET",
    },
  );
}


export async function selectTripFlight(
  tripId: string,
  offerId: string,
): Promise<SelectedFlightResponse> {
  return apiRequest<SelectedFlightResponse>(
    `/trips/${tripId}/flights/selected`,
    {
      method: "PUT",
      body: JSON.stringify({
        offer_id: offerId,
      }),
    },
  );
}


export async function getTripHotels(
  tripId: string,
): Promise<TripHotelsResponse> {
  return apiRequest<TripHotelsResponse>(
    `/trips/${tripId}/hotels`,
    { method: "GET" },
  );
}

export async function getSelectedTripHotel(
  tripId: string,
): Promise<SelectedHotelResponse | null> {
  return apiRequest<SelectedHotelResponse | null>(
    `/trips/${tripId}/hotels/selected`,
    { method: "GET" },
  );
}

export async function selectTripHotel(
  tripId: string,
  offerId: string,
): Promise<SelectedHotelResponse> {
  return apiRequest<SelectedHotelResponse>(
    `/trips/${tripId}/hotels/selected`,
    {
      method: "PUT",
      body: JSON.stringify({
        offer_id: offerId,
      }),
    },
  );
}

export async function deleteSelectedTripHotel(
  tripId: string,
): Promise<{ deleted: boolean }> {
  return apiRequest<{ deleted: boolean }>(
    `/trips/${tripId}/hotels/selected`,
    { method: "DELETE" },
  );
}