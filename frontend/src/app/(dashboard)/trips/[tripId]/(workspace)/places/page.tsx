import TripPlaces from "@/components/trip-workspace/places/TripPlaces";

import { mockTrip } from "@/data/mock-trip";

export default function TripPlacesPage() {
  const trip =
    mockTrip;

  return (
    <TripPlaces
      places={
        trip.places
      }
      alternatives={
        trip.placeAlternatives
      }
      currency={
        trip.currency
      }
    />
  );
}