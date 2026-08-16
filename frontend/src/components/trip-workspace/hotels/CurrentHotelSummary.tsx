import {
  CalendarDays,
  Hotel,
  MapPin,
  Star,
} from "lucide-react";

import {
  ThumbnailImage,
} from "@/components/ui";

import type {
  HotelComparisonOption,
} from "@/types/trip-workspace";

interface CurrentHotelSummaryProps {
  hotel: HotelComparisonOption;

  currency: string;
}

export default function CurrentHotelSummary({
  hotel,
  currency,
}: CurrentHotelSummaryProps) {
  const total =
    hotel.pricePerNight *
    hotel.nights;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#fb7185]">
        Current Accommodation
      </p>

      <div className="mt-3 flex gap-3">
        <ThumbnailImage
          src={hotel.image}
          alt={hotel.name}
          className="h-16 w-16 shrink-0 rounded-lg"
        />

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-[#e6e0e8]">
            {hotel.name}
          </h2>

          <p className="mt-1 text-xs text-[#d1bcff]">
            {hotel.room}
          </p>

          <div className="mt-1.5 flex items-center gap-1">
            {Array.from({
              length: hotel.rating,
            }).map((_, index) => (
              <Star
                key={index}
                size={10}
                fill="currentColor"
                className="text-[#fcd34d]"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2 text-xs text-[#948e9c]">
          <MapPin size={12} />

          {hotel.location}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#948e9c]">
          <CalendarDays
            size={12}
          />

          {hotel.nights}{" "}
          {hotel.nights === 1
            ? "night"
            : "nights"}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#948e9c]">
          <Hotel size={12} />

          {currency}{" "}
          {hotel.pricePerNight.toLocaleString()}
          /night
        </div>
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
          Current Total
        </p>

        <p className="mt-1 text-lg font-semibold text-[#fcd34d]">
          {currency}{" "}
          {total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}