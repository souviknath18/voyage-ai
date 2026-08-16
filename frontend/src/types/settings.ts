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