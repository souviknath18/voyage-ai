"use client";

import Link from "next/link";

import {
  ArrowRight,
  DollarSign,
  Flame,
} from "lucide-react";

import {
  Badge,
  Button,
  DestinationImage,
} from "@/components/ui";

import type {
  Destination,
} from "@/types/explore";

interface FeaturedDestinationCardProps {
  destination: Destination;
}

export default function FeaturedDestinationCard({
  destination,
}: FeaturedDestinationCardProps) {
  return (
    <article className="group relative h-[440px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18] sm:h-[420px]">
      {/* Destination Image / Placeholder */}
      <div className="absolute inset-0">
        <DestinationImage
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          className="h-full w-full"
          imageClassName="object-center transform-gpu transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      {/* Dark Overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#070B18] via-[#070B18]/55 to-transparent" />

      {/* Tags */}
      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        {/* <Badge variant="warning">
          <Flame size={12} />
          Trending
        </Badge> */}

        {destination.tag && (
          <Badge variant="neutral">
            {destination.tag}
          </Badge>
        )}
      </div>

      {/* Bottom Content */}
      <div className="absolute inset-x-0 bottom-8 z-10 p-4 sm:bottom-6 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-[1fr_220px] lg:items-end">
          {/* Destination Details */}
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-[#e6e0e8] sm:text-2xl">
              {destination.city},{" "}
              {destination.country}
            </h2>

            <p className="mt-2 max-w-xl overflow-hidden text-ellipsis text-xs leading-5 text-[#cbc4d2] line-clamp-2 sm:text-sm sm:leading-6 sm:line-clamp-2">
              {destination.description}
            </p>
          </div>

          {/* Trip Information */}
          <div className="rounded-xl border border-white/10 bg-[#070B18]/80 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-4">
            {/* Cost Level */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-[#948e9c]">
                Cost Level
              </span>

              <div className="flex items-center text-[#fcd34d]">
                {destination.costLevel !== undefined ? (
                  Array.from({
                    length: destination.costLevel,
                  }).map((_, index) => (
                    <DollarSign
                      key={index}
                      size={14}
                    />
                  ))
                ) : (
                  <span className="text-xs text-[#948e9c]">
                    Not available
                  </span>
                )}
              </div>
            </div>

            {/* Ideal Stay */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-[#948e9c]">
                Ideal Stay
              </span>

              <span className="text-right text-xs font-medium text-[#e6e0e8]">
                {destination.idealStay ?? "Not available"}
              </span>
            </div>

            {/* Explore Button */}
            <Link
              href={`/explore/${destination.id}`}
              className="mt-4 block"
            >
              <Button
                fullWidth
                size="sm"
              >
                Explore

                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Wikimedia Image Attribution */}
      {destination.imagePageUrl &&
        destination.imageArtist &&
        destination.imageLicense &&
        destination.imageLicenseUrl && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#070B18]/85 px-4 py-1 text-[10px] text-[#cbc4d2] backdrop-blur-sm">
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