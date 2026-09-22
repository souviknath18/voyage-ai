import type {
  TripItinerary,
  TripPlace as ApiTripPlace,
} from "@/lib/trips";

import type {
  TripPlace,
  TripPlaceCategory,
} from "@/types/trip-workspace";


function inferPlaceCategory(
  place: ApiTripPlace,
): TripPlaceCategory {
  const categories =
    place.categories.join(" ");

  if (
    place.search_group === "food" ||
    categories.includes("catering")
  ) {
    return "food";
  }

  if (
    place.search_group === "nature" ||
    categories.includes("natural") ||
    categories.includes("leisure.park")
  ) {
    return "nature";
  }

  if (
    place.search_group === "culture" ||
    categories.includes("heritage") ||
    categories.includes("religion") ||
    categories.includes("culture")
  ) {
    return "culture";
  }

  if (
    place.search_group === "shopping" ||
    categories.includes("commercial")
  ) {
    return "shopping";
  }

  return "attraction";
}


export function mapTripPlaces(
  places: ApiTripPlace[],
  itinerary: TripItinerary,
  placeImages: Record<string, string> = {},
): TripPlace[] {
  const itineraryPlaceMap =
    new Map<
      string,
      {
        dayNumber: number;
        estimatedCost: number;
        description: string;
      }
    >();

  for (const day of itinerary.days) {
    for (const activity of day.activities) {
      if (
        activity.activity_type !==
          "verified_place" ||
        !activity.place_id
      ) {
        continue;
      }

      if (
        !itineraryPlaceMap.has(
          activity.place_id,
        )
      ) {
        itineraryPlaceMap.set(
          activity.place_id,
          {
            dayNumber:
              day.day_number,

            estimatedCost:
              Number(
                activity.estimated_cost,
              ),

            description:
              activity.description,
          },
        );
      }
    }
  }

  return places.map((place) => {
    const itineraryUsage =
      itineraryPlaceMap.get(
        place.provider_place_id,
      );

    return {
      id: place.id,

      name: place.name,

      category:
        inferPlaceCategory(place),

      location:
        place.address ??
        "Location unavailable",

      description:
        itineraryUsage?.description ??
        "Discovered during VoyageAI trip research.",

      image:
        placeImages[
          place.id
        ],

      visitDuration: "",

      estimatedCost:
        itineraryUsage?.estimatedCost ??
        0,

      itineraryDay:
        itineraryUsage?.dayNumber,

      status:
        itineraryUsage
          ? "planned"
          : "optional",

      saved: false,

      recommended:
        Boolean(itineraryUsage),

      recommendationReason:
        itineraryUsage
          ? "Included in your AI-generated itinerary."
          : undefined,
    };
  });
}