
import type {
  AccommodationPreference,
  SettingsData,
  TravelPace,
  UserSettingsResponse,
  UserSettingsUpdate,
  ApiTravelPace,
} from "@/types/settings";


const ACCOMMODATION_OPTIONS:
  AccommodationPreference[] = [
    "boutique",
    "budget",
    "luxury",
    "hostel",
    "eco",
  ];


function toFrontendTravelPace(
  pace: ApiTravelPace,
): TravelPace {
  switch (pace) {
    case "relaxed":
      return "slow";

    case "packed":
      return "fast";

    default:
      return "balanced";
  }
}


function toBackendTravelPace(
  pace: TravelPace,
): ApiTravelPace {
  switch (pace) {
    case "slow":
      return "relaxed";

    case "fast":
      return "packed";

    default:
      return "balanced";
  }
}


/**
 * Convert FastAPI settings into the existing
 * Settings page data structure.
 *
 * Full name and email are provided separately
 * because they belong to the user profile.
 */
export function mapApiSettingsToFrontend(
  api: UserSettingsResponse,
  profile?: {
    fullName?: string;
    email?: string;
  },
): SettingsData {
  return {
    fullName: profile?.fullName ?? "",
    email: profile?.email ?? "",

    phone: api.phone ?? "",
    homeCity: api.home_city ?? "",
    preferredAirport:
      api.preferred_airport ?? "",

    currency: api.currency,
    region: api.region,

    travelPace: toFrontendTravelPace(
      api.travel_pace,
    ),

    accommodationPreferences:
      api.accommodation_preferences.filter(
        (
          preference,
        ): preference is AccommodationPreference =>
          ACCOMMODATION_OPTIONS.includes(
            preference as AccommodationPreference,
          ),
      ),

    dietaryRequirement:
      api.dietary_requirement,

    emailNotifications:
      api.email_notifications,

    tripUpdates: api.trip_updates,
    priceAlerts: api.price_alerts,
    weatherAlerts: api.weather_alerts,
    aiActivityAlerts:
      api.ai_activity_alerts,
    marketingEmails:
      api.marketing_emails,
  };
}


/**
 * Convert frontend settings into the
 * FastAPI PATCH request payload.
 *
 * fullName and email are excluded because
 * the User Settings API does not update them.
 */
export function mapFrontendSettingsToApi(
  settings: SettingsData,
): UserSettingsUpdate {
  return {
    phone: settings.phone.trim() || null,

    home_city:
      settings.homeCity.trim() || null,

    preferred_airport:
      settings.preferredAirport.trim() ||
      null,

    currency: settings.currency,
    region: settings.region,

    travel_pace: toBackendTravelPace(
      settings.travelPace,
    ),

    accommodation_preferences:
      settings.accommodationPreferences,

    dietary_requirement:
      settings.dietaryRequirement,

    email_notifications:
      settings.emailNotifications,

    trip_updates:
      settings.tripUpdates,

    price_alerts:
      settings.priceAlerts,

    weather_alerts:
      settings.weatherAlerts,

    ai_activity_alerts:
      settings.aiActivityAlerts,

    marketing_emails:
      settings.marketingEmails,
  };
}