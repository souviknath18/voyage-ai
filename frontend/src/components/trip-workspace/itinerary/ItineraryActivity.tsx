"use client";

import {
  BedDouble,
  Camera,
  Car,
  Clock3,
  MapPin,
  Mountain,
  RefreshCcw,
  ShoppingBag,
  Trash2,
  Utensils,
} from "lucide-react";

import {
  Badge,
  Card,
  ThumbnailImage,
} from "@/components/ui";

import type {
  ItineraryActivity,
  ItineraryActivityType,
} from "@/types/trip-workspace";

interface ItineraryActivityProps {
  activity: ItineraryActivity;

  currency: string;

  last?: boolean;

  onReplaceAction: (
    activityId: string,
  ) => void;

  onRemoveAction: (
    activityId: string,
  ) => void;
}

const activityIcons: Record<
  ItineraryActivityType,
  React.ComponentType<{
    size?: number;
    className?: string;
  }>
> = {
  transport: Car,
  hotel: BedDouble,
  food: Utensils,
  attraction: Camera,
  shopping: ShoppingBag,
  nature: Mountain,
  experience: Camera,
};

const activityColors: Record<
  ItineraryActivityType,
  string
> = {
  transport:
    "border-cyan-400/30 bg-[#0C1920] text-cyan-300",

  hotel:
    "border-[#fcd34d]/30 bg-[#211B10] text-[#fcd34d]",

  food:
    "border-[#fb7185]/30 bg-[#211117] text-[#fb7185]",

  attraction:
    "border-[#d1bcff]/30 bg-[#161222] text-[#d1bcff]",

  shopping:
    "border-pink-400/30 bg-[#21121C] text-pink-300",

  nature:
    "border-emerald-400/30 bg-[#0F1B18] text-emerald-300",

  experience:
    "border-orange-400/30 bg-[#20160F] text-orange-300",
};

export default function ItineraryActivity({
  activity,
  currency,
  last = false,
  onReplaceAction,
  onRemoveAction,
}: ItineraryActivityProps) {
  const Icon =
    activityIcons[
      activity.type
    ];

  return (
    <div className="relative flex gap-3 sm:gap-4">
      {/* Timeline */}
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border sm:h-11 sm:w-11 ${
            activityColors[
              activity.type
            ]
          }`}
        >
          <Icon size={17} />
        </div>

        {!last && (
          <div className="absolute bottom-0 left-1/2 top-10 w-px -translate-x-1/2 bg-white/10 sm:top-11" />
        )}
      </div>

      {/* Activity */}
      <Card className="group mb-4 min-w-0 flex-1 overflow-hidden p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Image */}
          <ThumbnailImage
            src={activity.image}
            alt={activity.title}
            className="h-36 w-full shrink-0 rounded-lg sm:h-24 sm:w-24"
          />

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#e6e0e8] sm:text-base">
                  {activity.title}
                </h3>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#948e9c]">
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={12} />

                    {activity.startTime}
                    {" • "}
                    {activity.duration}
                  </span>

                  {activity.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} />

                      {activity.location}
                    </span>
                  )}
                </div>
              </div>

              <Badge variant="neutral">
                {activity.type}
              </Badge>

              {activity.groundingType ===
                "verified_place" && (
                <Badge
                  variant="neutral"
                  className="border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                >
                  Verified place
                </Badge>
              )}
            </div>

            <p className="mt-2 text-xs leading-5 text-[#948e9c]">
              {activity.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {activity.estimatedCost !==
                  undefined && (
                  <span className="text-xs font-semibold text-[#fcd34d]">
                    {currency}{" "}
                    {activity.estimatedCost.toLocaleString()}
                  </span>
                )}

                {activity.booked && (
                  <span className="text-[10px] font-semibold text-emerald-400">
                    Pre-booked
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                <button
                  type="button"
                  title="Replace activity"
                  onClick={() =>
                    onReplaceAction(
                      activity.id,
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#948e9c] transition hover:border-[#d1bcff]/30 hover:text-[#d1bcff]"
                >
                  <RefreshCcw
                    size={14}
                  />
                </button>

                <button
                  type="button"
                  title="Remove activity"
                  onClick={() =>
                    onRemoveAction(
                      activity.id,
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#948e9c] transition hover:border-red-400/30 hover:text-red-400"
                >
                  <Trash2
                    size={14}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}