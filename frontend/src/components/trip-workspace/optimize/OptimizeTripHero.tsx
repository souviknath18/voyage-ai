import {
  CalendarDays,
  MapPin,
  Users,
  WalletCards,
} from "lucide-react";

import {
  DestinationImage,
} from "@/components/ui";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

interface OptimizeTripHeroProps {
  trip: TripWorkspaceData;
}

export default function OptimizeTripHero({
  trip,
}: OptimizeTripHeroProps) {
  return (
    <section className="relative min-h-[250px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18] sm:min-h-[290px]">
      {/* Image */}
      <div className="absolute inset-0">
        <DestinationImage
          src={trip.image}
          alt={trip.destination}
          className="h-full w-full"
          imageClassName="object-center"
        />
      </div>

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/35" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/65 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[250px] flex-col justify-end p-4 sm:min-h-[290px] sm:p-5 lg:p-6">
        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <MetaChip
            icon={MapPin}
            text={`${trip.origin} → ${trip.destination}`}
            accent="coral"
          />

          <MetaChip
            icon={
              CalendarDays
            }
            text={`${trip.startDate} - ${trip.endDate}`}
            accent="amber"
          />

          <MetaChip
            icon={Users}
            text={`${trip.travelers} ${
              trip.travelers ===
              1
                ? "Traveler"
                : "Travelers"
            }`}
          />
        </div>

        {/* Title */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#948e9c]">
              Optimize Trip
            </p>

            <h1 className="mt-1 text-xl font-semibold text-[#e6e0e8] sm:text-2xl">
              {trip.title}
            </h1>

            <p className="mt-1 text-xs text-[#948e9c]">
              Fine-tune your itinerary without rebuilding the trip from scratch.
            </p>
          </div>

          {/* Cost */}
          <div className="rounded-xl border border-white/10 bg-[#070B18]/75 p-3 backdrop-blur-xl sm:min-w-[180px]">
            <div className="flex items-center gap-1.5 text-[#7f8798]">
              <WalletCards
                size={12}
              />

              <span className="text-[9px] font-semibold uppercase tracking-wider">
                Estimated Cost
              </span>
            </div>

            <p className="mt-1.5 text-lg font-semibold text-[#fcd34d]">
              {trip.currency}{" "}
              {trip.estimatedCost.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaChip({
  icon: Icon,
  text,
  accent,
}: {
  icon: React.ComponentType<{
    size?: number;
  }>;

  text: string;

  accent?:
    | "coral"
    | "amber";
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border border-white/10 bg-[#070B18]/60 px-3 py-1.5 text-[10px] font-medium backdrop-blur-xl ${
        accent ===
        "coral"
          ? "text-[#fb7185]"
          : accent ===
              "amber"
            ? "text-[#fcd34d]"
            : "text-[#cbc4d2]"
      }`}
    >
      <Icon size={12} />

      {text}
    </div>
  );
}