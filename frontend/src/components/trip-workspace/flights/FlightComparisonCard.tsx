"use client";

import {
  Luggage,
  Plane,
  Sparkles,
  Timer,
  Wifi,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
} from "@/components/ui";

import type {
  FlightComparisonOption,
} from "@/types/trip-workspace";

interface FlightComparisonCardProps {
  flight: FlightComparisonOption;

  currency: string;

  onSelectAction: (
    flight: FlightComparisonOption,
  ) => void;
}

export default function FlightComparisonCard({
  flight,
  currency,
  onSelectAction,
}: FlightComparisonCardProps) {
  return (
    <Card
      className={`relative overflow-hidden p-4 transition-all duration-300 hover:-translate-y-0.5 ${
        flight.current
          ? "border-[#fb7185]/30"
          : ""
      }`}
    >
      {/* Label */}
      {flight.label && (
        <div className="absolute right-0 top-0">
          <FlightLabel
            label={
              flight.label
            }
          />
        </div>
      )}

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Details */}
        <div className="min-w-0 flex-1">
          {/* Airline */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-[#d1bcff]">
              <Plane size={18} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#e6e0e8] sm:text-base">
                {flight.airline}
              </h3>

              <p className="mt-0.5 text-xs text-[#948e9c]">
                {
                  flight.flightNumber
                }
                {" • "}
                {flight.cabin}
              </p>
            </div>
          </div>

          {/* Route */}
          <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <div>
              <p className="text-lg font-semibold text-[#e6e0e8]">
                {
                  flight.departureTime
                }
              </p>

              <p className="mt-0.5 text-xs text-[#948e9c]">
                {flight.from}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <p className="mb-2 flex items-center gap-1 text-[10px] text-[#948e9c]">
                <Timer size={11} />

                {flight.duration}

                <span>•</span>

                {flight.stops ===
                0
                  ? "Non-stop"
                  : `${flight.stops} ${
                      flight.stops ===
                      1
                        ? "Stop"
                        : "Stops"
                    }`}
              </p>

              <div className="relative h-px w-full bg-white/10">
                {flight.stops >
                  0 && (
                  <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fcd34d]" />
                )}

                <Plane
                  size={13}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#fb7185]"
                />
              </div>

              {flight.stopDescription && (
                <p className="mt-1.5 text-[9px] text-[#7f8798]">
                  {
                    flight.stopDescription
                  }
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-[#e6e0e8]">
                {
                  flight.arrivalTime
                }
              </p>

              <p className="mt-0.5 text-xs text-[#948e9c]">
                {flight.to}
              </p>
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-[#948e9c]">
            {flight.baggage && (
              <span className="flex items-center gap-1.5">
                <Luggage
                  size={12}
                />

                {flight.baggage}
              </span>
            )}

            {flight.wifi && (
              <span className="flex items-center gap-1.5">
                <Wifi size={12} />

                Wi-Fi
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex min-w-[180px] flex-col justify-center border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          {flight.current && (
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
              Current Selection
            </p>
          )}

          <p className="mt-1 text-xl font-semibold text-[#fcd34d]">
            {currency}{" "}
            {flight.price.toLocaleString()}
          </p>

          <Button
            size="sm"
            variant={
              flight.current
                ? "outline"
                : undefined
            }
            className="mt-4"
            onClick={() =>
              onSelectAction(
                flight,
              )
            }
          >
            {flight.current
              ? "Compare"
              : "Select Flight"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function FlightLabel({
  label,
}: {
  label: NonNullable<
    FlightComparisonOption["label"]
  >;
}) {
  if (
    label ===
    "recommended"
  ) {
    return (
      <div className="flex items-center gap-1 rounded-bl-lg bg-[#fb7185] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#24005b]">
        <Sparkles size={11} />

        VoyageAI Recommended
      </div>
    );
  }

  if (
    label === "cheapest"
  ) {
    return (
      <Badge variant="warning">
        Cheapest
      </Badge>
    );
  }

  return (
    <Badge variant="neutral">
      Fastest
    </Badge>
  );
}