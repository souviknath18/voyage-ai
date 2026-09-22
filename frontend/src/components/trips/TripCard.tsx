"use client";

import {
  CalendarDays,
  PlaneTakeoff,
  Users,
} from "lucide-react";

import {
  Badge,
  Card,
  DestinationImage,
} from "@/components/ui";

import type {
  TripListItem,
} from "@/types/trips";

import TripCardActions from "./TripCardActions";

interface TripCardProps {
  trip: TripListItem;
}

function getStatusVariant(
  status: TripListItem["status"],
) {
  switch (status) {
    case "upcoming":
      return "success";

    case "draft":
      return "warning";

    case "completed":
      return "neutral";

    case "saved":
      return "neutral";

    default:
      return "neutral";
  }
}

function getStatusLabel(
  status: TripListItem["status"],
) {
  switch (status) {
    case "upcoming":
      return "Ready";

    case "draft":
      return "Planning";

    case "completed":
      return "Completed";

    case "saved":
      return "Saved";

    default:
      return status;
  }
}

export default function TripCard({
  trip,
}: TripCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0 transition-colors duration-300 hover:border-white/20">
      {/* Image */}
      <div className="relative h-40 overflow-hidden sm:h-44">
        <DestinationImage
          src={trip.image}
          alt={trip.title}
          className="h-full w-full"
          imageClassName="object-center transform-gpu transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Image Overlay */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#070B18]/70 via-transparent to-black/15" />

        {/* Status */}
        <div className="absolute right-3 top-3 z-10">
          <Badge
            variant={
              getStatusVariant(
                trip.status,
              )
            }
          >
            {getStatusLabel(
              trip.status,
            )}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Route */}
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#948e9c]">
          <span className="truncate">
            {trip.origin}
          </span>

          <PlaneTakeoff
            size={13}
            className="shrink-0 text-[#fb7185]"
          />

          <span className="truncate text-[#fb7185]">
            {trip.destination}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
          {trip.title}
        </h2>

        {/* Dates */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#948e9c]">
          <CalendarDays
            size={14}
            className="shrink-0"
          />

          <span>
            {trip.startDate &&
            trip.endDate
              ? `${trip.startDate} - ${trip.endDate}`
              : "Flexible dates"}
          </span>

          <span>•</span>

          <span>
            {trip.duration}{" "}
            {trip.duration === 1
              ? "Day"
              : "Days"}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
              Est. Cost
            </p>

            <p
              className={`mt-1 text-base font-semibold ${
                trip.estimatedCost
                  ? "text-[#fcd34d]"
                  : "text-[#948e9c]"
              }`}
            >
              {trip.estimatedCost
                ? `${trip.currency} ${trip.estimatedCost.toLocaleString()}`
                : "TBD"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[#948e9c]">
            <Users size={15} />

            <span className="text-xs">
              {trip.travelers}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5">
          <TripCardActions
            trip={trip}
          />
        </div>
      </div>
    </Card>
  );
}