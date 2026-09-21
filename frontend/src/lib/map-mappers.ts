import type {
  TripItinerary,
  TripPlace as ApiTripPlace,
} from "@/lib/trips";

import type {
  TripMapDay,
  TripMapLocation,
} from "@/types/trip-workspace";


function inferMapLocationType(
  place: ApiTripPlace,
): TripMapLocation["type"] {
  const categories =
    place.categories.join(" ");

  if (
    place.search_group === "food" ||
    categories.includes("catering")
  ) {
    return "food";
  }

  if (
    place.search_group === "shopping" ||
    categories.includes("commercial")
  ) {
    return "shopping";
  }

  return "attraction";
}


export function mapTripToMapDays(
  itinerary: TripItinerary,
  places: ApiTripPlace[],
): TripMapDay[] {
  const placesByProviderId =
    new Map(
      places.map((place) => [
        place.provider_place_id,
        place,
      ]),
    );

  return itinerary.days.map(
    (day): TripMapDay => {
      const locations: TripMapLocation[] =
        [];

      for (
        const activity
        of day.activities
      ) {
        if (
          activity.activity_type !==
            "verified_place" ||
          !activity.place_id
        ) {
          continue;
        }

        const place =
          placesByProviderId.get(
            activity.place_id,
          );

        if (!place) {
          continue;
        }

        const latitude =
          Number(place.latitude);

        const longitude =
          Number(place.longitude);

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          continue;
        }

        locations.push({
          id: activity.id,

          name: place.name,

          subtitle:
            place.address ??
            undefined,

          dayNumber:
            day.day_number,

          time: activity.time,

          type:
            inferMapLocationType(
              place,
            ),

          latitude,
          longitude,

          // Temporary.
          // Real map coordinates will
          // replace these.
          mapX: 0,
          mapY: 0,

          estimatedCost:
            Number(
              activity.estimated_cost,
            ),
        });
      }

      return {
        dayNumber:
          day.day_number,

        date: day.date,

        title: day.title,

        locations,
      };
    },
  );
}