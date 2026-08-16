import {
  DestinationImage,
} from "@/components/ui";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

interface ExportPreviewHeroProps {
  trip:
    TripWorkspaceData;
}

export default function ExportPreviewHero({
  trip,
}: ExportPreviewHeroProps) {
  return (
    <div className="relative h-52 overflow-hidden sm:h-60">
      <DestinationImage
        src={trip.image}
        alt={trip.title}
        className="absolute inset-0 h-full w-full"
        imageClassName="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#141218] via-[#141218]/65 to-black/10" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-end sm:p-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#fcd34d]">
            Bespoke Journey
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {trip.title}
          </h1>

          <p className="mt-1.5 text-sm text-[#cbc4d2]">
            {trip.startDate} –{" "}
            {trip.endDate}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#948e9c]">
            Prepared By
          </p>

          <p className="mt-1 text-sm font-semibold text-[#e6e0e8]">
            VoyageAI
          </p>
        </div>
      </div>
    </div>
  );
}