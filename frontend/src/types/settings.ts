export type TravelPace =
  | "slow"
  | "balanced"
  | "fast";

export type AccommodationPreference =
  | "boutique"
  | "budget"
  | "luxury"
  | "hostel"
  | "eco";

export interface SettingsData {
  fullName: string;

  email: string;

  phone: string;

  homeCity: string;

  preferredAirport: string;

  currency: string;

  region: string;

  travelPace: TravelPace;

  accommodationPreferences:
    AccommodationPreference[];

  dietaryRequirement: string;

  emailNotifications: boolean;

  tripUpdates: boolean;

  priceAlerts: boolean;

  weatherAlerts: boolean;

  aiActivityAlerts: boolean;

  marketingEmails: boolean;
}



export type ApiTravelPace =
  | "relaxed"
  | "balanced"
  | "packed";

export interface UserSettingsResponse {
  user_id: string;
  phone: string | null;
  home_city: string | null;
  preferred_airport: string | null;
  currency: string;
  region: string;
  travel_pace: ApiTravelPace;
  accommodation_preferences: string[];
  dietary_requirement: string;
  email_notifications: boolean;
  trip_updates: boolean;
  price_alerts: boolean;
  weather_alerts: boolean;
  ai_activity_alerts: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

export type UserSettingsUpdate = Partial<
  Omit<
    UserSettingsResponse,
    | "user_id"
    | "created_at"
    | "updated_at"
  >
>;