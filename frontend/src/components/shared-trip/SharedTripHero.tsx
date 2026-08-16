import {
  CalendarDays,
  Users,
} from "lucide-react";

import {
  DestinationImage,
} from "@/components/ui";

import type {
  SharedTripData,
} from "@/types/shared-trip";

interface SharedTripHeroProps {
  trip:
    SharedTripData;
}

export default function SharedTripHero({
  trip,
}: SharedTripHeroProps) {
  return (
    <section className="group relative min-h-[420px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18] sm:min-h-[500px]">
      <DestinationImage
        src={trip.image}
        alt={`${trip.destination}, ${trip.country}`}
        className="absolute inset-0 h-full w-full"
        imageClassName="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />

      <div className="absolute inset-0 bg-black/25" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/55 to-transparent" />

      <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-5 sm:min-h-[500px] sm:p-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fcd34d]">
          Shared Itinerary
        </span>

        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {trip.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#cbc4d2]">
          <span className="flex items-center gap-1.5">
            <CalendarDays
              size={14}
              className="text-[#fb7185]"
            />

            {trip.startDate} –{" "}
            {trip.endDate}
          </span>

          <span>
            {trip.duration} Days
          </span>

          <span className="flex items-center gap-1.5">
            <Users size={14} />

            {trip.travelers}{" "}
            {trip.travelers === 1
              ? "Traveler"
              : "Travelers"}
          </span>
        </div>

        {trip.note && (
          <div className="mt-5 w-fit max-w-xl rounded-xl border border-white/10 bg-[#070B18]/65 px-4 py-3">
            <p className="text-sm italic leading-6 text-[#cbc4d2]">
              “{trip.note}”
            </p>
          </div>
        )}
      </div>
    </section>
  );
}