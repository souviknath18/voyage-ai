import type {
  Trip,
  TripItinerary,
} from "@/lib/trips";

import type {
  TripWorkspaceHeaderData,
} from "@/types/trip-workspace";


export function mapTripToWorkspaceHeader(
  trip: Trip,
  itinerary: TripItinerary | null,
  image?: string,
): TripWorkspaceHeaderData {
  const startDate =
    new Date(trip.start_date);

  const endDate =
    new Date(trip.end_date);

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const duration =
    Math.floor(
      (
        endDate.getTime() -
        startDate.getTime()
      ) / millisecondsPerDay,
    ) + 1;

  const totalBudget =
    Number(trip.budget ?? 0);

  const estimatedCost =
    itinerary
      ? Number(
          itinerary.estimated_total_cost,
        )
      : 0;

  const remainingBudget =
    totalBudget - estimatedCost;

  return {
    id: trip.trip_id,

    title:
      `${trip.destination} Trip`,

    origin: trip.origin_name ?? trip.origin.split(",")[0].trim(),
    destination: trip.destination_name ?? trip.destination.split(",")[0].trim(),

    startDate: trip.start_date,
    endDate: trip.end_date,

    duration,

    travelers: trip.travelers,

    status:
      trip.status === "upcoming"
        ? "ready"
        : trip.status === "draft"
          ? "planning"
          : "warning",

    currency: trip.currency,

    totalBudget,
    estimatedCost,
    remainingBudget,

    image,
  };
}