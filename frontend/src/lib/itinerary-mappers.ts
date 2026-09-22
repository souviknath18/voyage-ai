import {
  TripItinerary,
  TripWeather,
} from "@/lib/trips";

import type {
  ItineraryActivityType,
  ItineraryDayData,
} from "@/types/trip-workspace";

function inferActivityType(
  title: string,
): ItineraryActivityType {
  const value = title.toLowerCase();

  if (
    value.includes("breakfast") ||
    value.includes("lunch") ||
    value.includes("dinner") ||
    value.includes("restaurant") ||
    value.includes("cafe") ||
    value.includes("food")
  ) {
    return "food";
  }

  if (
    value.includes("hotel") ||
    value.includes("check-in") ||
    value.includes("check-out")
  ) {
    return "hotel";
  }

  if (
    value.includes("transfer") ||
    value.includes("drive") ||
    value.includes("airport") ||
    value.includes("flight")
  ) {
    return "transport";
  }

  if (
    value.includes("shopping") ||
    value.includes("market") ||
    value.includes("souvenir")
  ) {
    return "shopping";
  }

  if (
    value.includes("forest") ||
    value.includes("mount") ||
    value.includes("rice") ||
    value.includes("nature")
  ) {
    return "nature";
  }

  return "attraction";
}

export function mapItineraryToWorkspace(
  itinerary: TripItinerary,
  weather: TripWeather | null = null,
  activityImages: Record<string, string> = {},
): ItineraryDayData[] {
  return itinerary.days.map((day) => ({
    id: day.id,

    dayNumber: day.day_number,

    title: day.title,

    date: day.date,

    estimatedCost:
      day.activities.reduce(
        (total, activity) =>
          total +
          Number(activity.estimated_cost),
        0,
      ),

    weather: (() => {
      const forecast = weather?.forecast.find(
        (forecastDay) =>
          forecastDay.date === day.date,
      );

      if (!forecast) {
        return {
          temperature: null,
          condition: "Forecast unavailable",
        };
      }

      return {
        temperature:
          forecast.temperature_max,
        condition:
          forecast.weather_description,
      };
    })(),

    activities: day.activities.map(
      (activity) => ({
        id: activity.id,

        title: activity.title,

        description:
          activity.description,

        type: inferActivityType(
          activity.title,
        ),

        startTime: activity.time,

        groundingType:
          activity.activity_type,

        placeId:
          activity.place_id ??
          undefined,

        duration: "",

        location:
          activity.location ??
          undefined,

        estimatedCost: Number(
          activity.estimated_cost,
        ),

        image:
          activityImages[
            activity.id
          ],

        booked: false,
      }),
    ),
  }));
}