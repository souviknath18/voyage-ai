import {
  ArrowRight,
  Plane,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

import type {
  TripFlight,
} from "@/types/trip-workspace";

interface TripFlightCardProps {
  flights: TripFlight[];

  onCompareAction?: () => void;
}

export default function TripFlightCard({
  flights,
  onCompareAction,
}: TripFlightCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane
            size={17}
            className="text-[#d1bcff]"
          />

          <h2 className="text-base font-semibold text-[#e6e0e8]">
            Flights
          </h2>
        </div>

        <button
          type="button"
          className="text-xs font-medium text-[#d1bcff] hover:text-[#eaddff]"
          onClick={
            onCompareAction
          }
        >
          Compare
        </button>
      </div>

      <div className="space-y-3">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-3 transition hover:border-[#d1bcff]/30"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#d1bcff]">
                  {flight.type}
                </span>

                <span className="text-[10px] text-[#7f8798]">
                  {flight.departureTime}
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-[#e6e0e8]">
                {flight.airline}{" "}
                {flight.flightNumber}
              </p>

              <p className="mt-1 text-xs text-[#948e9c]">
                {flight.route}
              </p>
            </div>

            <ArrowRight
              size={15}
              className="text-[#7f8798] transition group-hover:translate-x-0.5 group-hover:text-[#d1bcff]"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}