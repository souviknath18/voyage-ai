import TripMap from "@/components/trip-workspace/map/TripMap";

import { mockTrip } from "@/data/mock-trip";

export default function TripMapPage() {
  const trip =
    mockTrip;

  return (
    <TripMap
      days={
        trip.mapDays
      }
      currency={
        trip.currency
      }
      destination={
        trip.destination
      }
    />
  );
}