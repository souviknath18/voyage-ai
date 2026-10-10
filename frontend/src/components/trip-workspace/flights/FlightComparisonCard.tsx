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
  removing?: boolean;

  onSelectAction: (
    flight: FlightComparisonOption,
  ) => void;

  onRemoveAction: () => void;
}

export default function FlightComparisonCard({
  flight,
  currency,
  onSelectAction,
  onRemoveAction,
  removing = false,
}: FlightComparisonCardProps) {
  return (
    <Card
      className={`relative overflow-hidden p-4 transition-all duration-300 hover:-translate-y-0.5 ${
        flight.current
          ? "border-[#fb7185]/60 bg-[#fb7185]/[0.04] ring-1 ring-[#fb7185]/20"
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
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#fb7185]">
              ✓ Selected Flight
            </p>
          )}

          <p className="mt-1 text-xl font-semibold text-[#fcd34d]">
            {flight.convertedCurrency ??
              flight.currency}{" "}
            {(
              flight.convertedPrice ??
              flight.price
            ).toLocaleString()}
          </p>

          {flight.convertedPrice !==
            undefined &&
            flight.convertedCurrency !==
              flight.currency && (
              <p className="mt-1 text-xs text-[#7f8798]">
                ≈ {flight.currency}{" "}
                {flight.price.toLocaleString()}
              </p>
            )}

          <Button
            size="sm"
            variant={
              flight.current
                ? "outline"
                : undefined
            }
            className="mt-4"
            disabled={flight.current}
            onClick={() =>
              onSelectAction(
                flight,
              )
            }
          >
            {flight.current
              ? "Selected"
              : "Select Flight"}
          </Button>

          {flight.current && (
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full border-red-400/30 text-red-300 hover:bg-red-400/10"
              disabled={removing}
              onClick={onRemoveAction}
            >
              {removing ? "Removing..." : "Remove Flight"}
            </Button>
          )}
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