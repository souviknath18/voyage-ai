import type {
  TripListItem,
  TripTab,
} from "@/types/trips";

import TripCard from "./TripCard";
import TripCardSkeleton from "./TripCardSkeleton";
import TripEmptyState from "./TripEmptyState";

interface TripsGridProps {
  trips: TripListItem[];
  activeTab: TripTab;
  loading?: boolean;

  savingTripId: string | null;

  onSavedChangeAction: (
    tripId: string,
    isSaved: boolean,
  ) => void;
}

export default function TripsGrid({
  trips,
  activeTab,
  loading = false,
  savingTripId,
  onSavedChangeAction,
}: TripsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <TripCardSkeleton
            key={index}
          />
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <TripEmptyState
          tab={activeTab}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          isSaving={
            savingTripId === trip.id
          }
          onSavedChangeAction={
            onSavedChangeAction
          }
        />
      ))}
    </div>
  );
}