import TripItinerary from "@/components/trip-workspace/itinerary/TripItinerary";

import { mockTrip } from "@/data/mock-trip";

export default function TripItineraryPage() {
  const trip =
    mockTrip;

  return (
    <TripItinerary
      itinerary={
        trip.itinerary
      }
      currency={
        trip.currency
      }
    />
  );
}