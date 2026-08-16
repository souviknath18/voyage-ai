"use client";

import {
  Bookmark,
  CalendarDays,
} from "lucide-react";

import type {
  Destination,
} from "@/types/explore";
import { DestinationImage } from "../ui";

interface DestinationCardProps {
  destination: Destination;

  onSaveAction: (
    id: string,
  ) => void;
}

export default function DestinationCard({
  destination,
  onSaveAction,
}: DestinationCardProps) {
  return (
    <article className="group relative min-h-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18]">
      {/* Image */}
      <DestinationImage
        src={destination.image}
        alt={`${destination.city}, ${destination.country}`}
        className="absolute -left-[2px] -top-[2px] h-[calc(100%+4px)] w-[calc(100%+4px)]"
        imageClassName="object-center backface-hidden transform-gpu transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.05]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/45 to-black/10" />

      {/* Save */}
      <button
        type="button"
        onClick={() =>
          onSaveAction(
            destination.id,
          )
        }
        aria-label="Save destination"
        className={`absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#070B18]/60 backdrop-blur-xl transition ${
          destination.saved
            ? "text-[#fb7185]"
            : "text-[#e6e0e8] hover:text-[#fb7185]"
        }`}
      >
        <Bookmark
          size={15}
          fill={
            destination.saved
              ? "currentColor"
              : "none"
          }
        />
      </button>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#fb7185]">
          {destination.tag}
        </span>

        <h3 className="mt-1 text-lg font-semibold text-[#e6e0e8]">
          {destination.city},{" "}
          {destination.country}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#cbc4d2]">
          {destination.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#948e9c]">
            <CalendarDays size={13} />

            {destination.bestTime}
          </div>

          <span className="text-xs font-medium text-[#d1bcff]">
            {destination.idealStay}
          </span>
        </div>
      </div>
    </article>
  );
}