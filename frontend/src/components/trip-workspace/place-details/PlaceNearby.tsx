import {
  MapPin,
} from "lucide-react";

import {
  ThumbnailImage,
} from "@/components/ui";

import type {
  NearbyPlace,
} from "@/types/trip-workspace";

interface PlaceNearbyProps {
  places: NearbyPlace[];

  onSelectAction?: (
    id: string,
  ) => void;
}

export default function PlaceNearby({
  places,
  onSelectAction,
}: PlaceNearbyProps) {
  if (
    places.length === 0
  ) {
    return null;
  }

  return (
    <section>
      <h2 className="text-base font-semibold text-[#e6e0e8]">
        Nearby Attractions
      </h2>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
        {places.map(
          (place) => (
            <button
              key={
                place.id
              }
              type="button"
              onClick={() =>
                onSelectAction?.(
                  place.id,
                )
              }
              className="group min-w-[190px] rounded-xl border border-white/10 bg-white/[0.03] p-2 text-left transition hover:bg-white/[0.05]"
            >
              <ThumbnailImage
                src={
                  place.image
                }
                alt={
                  place.name
                }
                className="h-24 w-full rounded-lg"
              />

              <div className="px-1 pb-1 pt-2">
                <h3 className="truncate text-xs font-semibold text-[#e6e0e8]">
                  {place.name}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-[10px] text-[#7f8798]">
                  <MapPin
                    size={10}
                  />

                  {
                    place.distance
                  }
                </p>
              </div>
            </button>
          ),
        )}
      </div>
    </section>
  );
}