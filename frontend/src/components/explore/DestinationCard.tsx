"use client";

import Link from "next/link";

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
        className="absolute inset-0 h-full w-full"
        imageClassName="object-center transform-gpu transition-transform duration-500 group-hover:scale-[1.04]"
      />

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#070B18]/95 via-[#070B18]/50 to-transparent" />

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

      <Link
        href={`/explore/${encodeURIComponent(destination.id)}`}
        aria-label={`Explore ${destination.city}, ${destination.country}`}
        className="absolute inset-0 z-[2] rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#fb7185]"
      />

      {/* Content */}
      <div
        className={`absolute inset-x-0 z-10 p-4 ${
          destination.imagePageUrl &&
          destination.imageArtist &&
          destination.imageLicense &&
          destination.imageLicenseUrl
            ? "bottom-5"
            : "bottom-0"
        }`}
      >
        {destination.tag && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#fb7185]">
            {destination.tag}
          </span>
        )}

        <h3 className="mt-1 text-lg font-semibold text-[#e6e0e8] transition-colors group-hover:text-[#d1bcff]">
          {destination.city}, {destination.country}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#cbc4d2]">
          {destination.description}
        </p>

        {(destination.bestTime || destination.idealStay) && (
          <div className="mt-3 flex items-center justify-between">
            {destination.bestTime ? (
              <div className="flex items-center gap-1.5 text-xs text-[#948e9c]">
                <CalendarDays size={13} />
                {destination.bestTime}
              </div>
            ) : (
              <div />
            )}

            {destination.idealStay && (
              <span className="text-xs font-medium text-[#d1bcff]">
                {destination.idealStay}
              </span>
            )}
          </div>
        )}
      </div>

      {destination.imagePageUrl &&
        destination.imageArtist &&
        destination.imageLicense &&
        destination.imageLicenseUrl && (
          <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-1 text-[10px] text-[#cbc4d2]">
            Photo by {destination.imageArtist} ·{" "}
            <a
              href={destination.imagePageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Source
            </a>
            {" · "}
            <a
              href={destination.imageLicenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              {destination.imageLicense}
            </a>
          </div>
        )}
    </article>
  );
}