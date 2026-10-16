
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sparkles,
} from "lucide-react";

import type { ExploreDestinationApi } from "@/types/explore";

interface DestinationHeroProps {
  destination: ExploreDestinationApi;
}

export default function DestinationHero({
  destination,
}: DestinationHeroProps) {
  return (
    <section className="relative isolate h-[370px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#070B18] sm:h-[430px]">
      {/* Destination background image */}
      {destination.image_url && (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${destination.image_url}")`,
          }}
          role="img"
          aria-label={`${destination.name}, ${destination.country}`}
        />
      )}

      {/* Bottom dark gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

      {/* Desktop back link */}
      <div className="absolute left-6 top-5 z-20 hidden lg:block">
        <Link
          href="/explore"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-medium text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:border-white/25 hover:bg-black/45"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-5 lg:p-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          {/* Country */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-[#e6e0e8] backdrop-blur-xl">
            <MapPin size={14} className="text-[#fb7185]" />
            <span>{destination.country}</span>
          </div>

          {/* Destination name */}
          <h1 className="bg-gradient-to-r from-[#fb7185] via-[#fda88b] to-[#fcd34d] bg-clip-text text-3xl font-bold leading-tight tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            {destination.name}
          </h1>

          {/* Description */}
          <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-relaxed text-[#e6e0e8]/90 md:text-base">
            {destination.description?.trim() ||
              `Discover ${destination.name}, ${destination.country}, and plan your next journey.`}
          </p>

          {/* AI planning button */}
          <Link
            href={`/plan-trip?destination=${encodeURIComponent(destination.wikidata_id)}`}
            className="group mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d] px-6 py-3 text-sm font-semibold text-[#2e1065] shadow-[0_0_24px_rgba(251,113,133,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(251,113,133,0.5)] sm:px-8"
          >
            <Sparkles size={17} />
            Plan a Trip Here with AI
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}