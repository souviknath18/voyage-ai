"use client";

import type {
  Destination,
} from "@/types/explore";

import DestinationCard from "./DestinationCard";
import FeaturedDestinationCard from "./FeaturedDestinationCard";

interface DestinationGridProps {
  destinations: Destination[];

  onSaveAction: (
    id: string,
  ) => void;
}

export default function DestinationGrid({
  destinations,
  onSaveAction,
}: DestinationGridProps) {
  if (
    destinations.length === 0
  ) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-14 text-center">
        <h2 className="text-base font-semibold text-[#e6e0e8]">
          No destinations found
        </h2>

        <p className="mt-2 text-sm text-[#948e9c]">
          Try another category or change your filters.
        </p>
      </div>
    );
  }

  const featured =
    destinations.find(
      (destination) =>
        destination.featured,
    ) ?? destinations[0];

  const remaining =
    destinations.filter(
      (destination) =>
        destination.id !==
        featured.id,
    );

  return (
    <div className="space-y-5">
      <FeaturedDestinationCard
        destination={featured}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {remaining.map(
          (destination) => (
            <DestinationCard
              key={
                destination.id
              }
              destination={
                destination
              }
              onSaveAction={
                onSaveAction
              }
            />
          ),
        )}
      </div>
    </div>
  );
}