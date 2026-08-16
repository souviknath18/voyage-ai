import {
  Hotel,
  MapPin,
} from "lucide-react";

import {
  DestinationImage,
} from "@/components/ui";

import type {
  SharedTripHotel,
} from "@/types/shared-trip";

interface SharedTripHotelCardProps {
  hotel:
    SharedTripHotel;
}

export default function SharedTripHotelCard({
  hotel,
}: SharedTripHotelCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="relative h-36">
        <DestinationImage
          src={hotel.image}
          alt={hotel.name}
          className="absolute inset-0 h-full w-full"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] to-transparent" />

        <span className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-[#070B18]/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#cbc4d2]">
          Selected Stay
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <Hotel
            size={15}
            className="text-[#d1bcff]"
          />

          <h3 className="text-sm font-semibold text-[#e6e0e8]">
            {hotel.name}
          </h3>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#948e9c]">
          <MapPin size={12} />

          {hotel.location}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotel.tags.map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-[#cbc4d2]"
              >
                {tag}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}