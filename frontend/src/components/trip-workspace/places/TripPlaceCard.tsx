"use client";

import {
  Bookmark,
  Clock3,
  MapPin,
  RefreshCcw,
  Sparkles,
  Star,
  Trash2,
  WalletCards,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  DestinationImage,
} from "@/components/ui";

import type {
  TripPlace,
  TripPlaceCategory,
} from "@/types/trip-workspace";

interface TripPlaceCardProps {
  place: TripPlace;

  currency: string;

  onSaveAction: (
    id: string,
  ) => void;

  onRemoveAction: (
    id: string,
  ) => void;

  onReplaceAction: (
    id: string,
  ) => void;

  onAddAction: (
    id: string,
  ) => void;
}

const categoryColors: Record<
  TripPlaceCategory,
  string
> = {
  attraction:
    "border-[#d1bcff]/20 bg-[#d1bcff]/10 text-[#d1bcff]",

  food:
    "border-[#fcd34d]/20 bg-[#fcd34d]/10 text-[#fcd34d]",

  culture:
    "border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]",

  technology:
    "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",

  shopping:
    "border-pink-400/20 bg-pink-400/10 text-pink-300",

  nature:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

export default function TripPlaceCard({
  place,
  currency,
  onSaveAction,
  onRemoveAction,
  onReplaceAction,
  onAddAction,
}: TripPlaceCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <DestinationImage
          src={place.image}
          alt={place.name}
          className="h-full w-full"
          imageClassName="object-center transform-gpu transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18]/70 via-transparent to-black/15" />

        {/* Category */}
        <span
          className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider backdrop-blur-xl ${
            categoryColors[
              place.category
            ]
          }`}
        >
          {place.category}
        </span>

        {/* Save */}
        <button
          type="button"
          aria-label="Save place"
          onClick={() =>
            onSaveAction(place.id)
          }
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#070B18]/65 backdrop-blur-xl transition ${
            place.saved
              ? "text-[#fb7185]"
              : "text-[#e6e0e8] hover:text-[#fb7185]"
          }`}
        >
          <Bookmark
            size={15}
            fill={
              place.saved
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-[#e6e0e8]">
              {place.name}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#948e9c]">
              <MapPin size={12} />

              {place.location}
            </p>
          </div>

          <PlaceStatusBadge
            status={
              place.status
            }
          />
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#948e9c]">
          {place.description}
        </p>

        {/* Info */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#948e9c]">
          <span className="flex items-center gap-1.5">
            <Clock3 size={12} />

            {place.visitDuration}
          </span>

          <span className="flex items-center gap-1.5">
            <WalletCards size={12} />

            {place.estimatedCost > 0
              ? `${currency} ${place.estimatedCost.toLocaleString()}`
              : "Free"}
          </span>

          {place.rating && (
            <span className="flex items-center gap-1 text-[#fcd34d]">
              <Star
                size={12}
                fill="currentColor"
              />

              {place.rating}
            </span>
          )}
        </div>

        {/* Itinerary */}
        {place.itineraryDay && (
          <div className="mt-3 text-[10px] font-medium text-[#d1bcff]">
            Day {place.itineraryDay}
          </div>
        )}

        {/* AI Explanation */}
        {place.recommended &&
          place.recommendationReason && (
          <div className="mt-4 rounded-lg border border-[#fb7185]/20 bg-[#fb7185]/[0.05] p-2.5">
            <div className="flex items-start gap-2">
              <Sparkles
                size={13}
                className="mt-0.5 shrink-0 text-[#fb7185]"
              />

              <div>
                <p className="text-[10px] font-semibold text-[#fb7185]">
                  VoyageAI Recommended
                </p>

                <p className="mt-0.5 text-[10px] leading-4 text-[#948e9c]">
                  {
                    place.recommendationReason
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4">
          {place.status ===
          "planned" ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onReplaceAction(
                    place.id,
                  )
                }
              >
                <RefreshCcw
                  size={13}
                />

                Replace
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onRemoveAction(
                    place.id,
                  )
                }
                className="hover:border-red-400/30 hover:text-red-400"
              >
                <Trash2
                  size={13}
                />

                Remove
              </Button>
            </div>
          ) : (
            <Button
              fullWidth
              size="sm"
              onClick={() =>
                onAddAction(
                  place.id,
                )
              }
            >
              Add to Itinerary
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function PlaceStatusBadge({
  status,
}: {
  status: TripPlace["status"];
}) {
  if (
    status === "planned"
  ) {
    return (
      <Badge variant="success">
        Planned
      </Badge>
    );
  }

  if (
    status === "saved"
  ) {
    return (
      <Badge variant="warning">
        Saved
      </Badge>
    );
  }

  return (
    <Badge variant="neutral">
      Optional
    </Badge>
  );
}