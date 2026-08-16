"use client";

import {
  ArrowLeft,
  Bookmark,
  CalendarPlus,
  MapPin,
  Star,
} from "lucide-react";

import {
  Button,
  DestinationImage,
} from "@/components/ui";

import type {
  PlaceDetailsData,
} from "@/types/trip-workspace";

interface PlaceDetailsHeroProps {
  place:
    PlaceDetailsData;

  onBackAction: () => void;

  onSaveAction: () => void;

  onAddAction: () => void;
}

export default function PlaceDetailsHero({
  place,
  onBackAction,
  onSaveAction,
  onAddAction,
}: PlaceDetailsHeroProps) {
  return (
    <section className="group relative min-h-[380px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18] sm:min-h-[460px]">
      {/* Image */}
      <div className="absolute inset-0">
        <DestinationImage
          src={place.image}
          alt={place.name}
          className="h-full w-full"
          imageClassName="object-cover object-center"
        />
      </div>

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/55 to-transparent" />

      {/* Back */}
      <button
        type="button"
        onClick={
          onBackAction
        }
        className="absolute left-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#070B18]/60 text-[#e6e0e8] backdrop-blur-xl transition hover:bg-[#070B18]/80"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Content */}
      <div className="relative z-10 flex min-h-[380px] flex-col justify-end p-4 sm:min-h-[460px] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-[#070B18]/60 px-2.5 py-1 text-[10px] font-semibold text-[#cbc4d2] backdrop-blur-xl">
                {place.category}
              </span>

              <span className="flex items-center gap-1 text-xs text-[#fcd34d]">
                <Star
                  size={12}
                  fill="currentColor"
                />

                {place.rating}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#e6e0e8] sm:text-3xl">
              {place.name}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#cbc4d2]">
              <MapPin
                size={14}
              />

              {place.location}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={
                onSaveAction
              }
            >
              <Bookmark
                size={14}
                fill={
                  place.saved
                    ? "currentColor"
                    : "none"
                }
              />

              {place.saved
                ? "Saved"
                : "Save Place"}
            </Button>

            <Button
              size="sm"
              onClick={
                onAddAction
              }
            >
              <CalendarPlus
                size={14}
              />

              {place.status ===
              "planned"
                ? "In Itinerary"
                : "Add to Trip"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}