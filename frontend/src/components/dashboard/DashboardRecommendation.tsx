"use client";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  DestinationImage,
} from "@/components/ui";

export default function DashboardRecommendation() {
  const router =
    useRouter();

  return (
    <article className="relative min-h-[250px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18]">
      <div className="grid min-h-[250px] grid-cols-1 sm:grid-cols-2">
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-5 sm:p-6">
          <div className="flex items-center gap-1.5">
            <Sparkles
              size={13}
              className="text-[#fcd34d]"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#fcd34d]">
              Curated For You
            </span>
          </div>

          <h2 className="mt-3 text-xl font-semibold text-[#e6e0e8]">
            Amalfi Coast, Italy
          </h2>

          <p className="mt-2 max-w-sm text-xs leading-5 text-[#948e9c] sm:text-[13px]">
            Based on your interest in coastal scenery, photography and food experiences, VoyageAI recommends a late-summer escape to the Amalfi Coast.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/explore/amalfi",
              )
            }
            className="mt-5 flex w-fit items-center gap-1.5 text-xs font-semibold text-[#fb7185] transition hover:text-[#fcd34d]"
          >
            Explore Destination

            <ArrowRight
              size={13}
            />
          </button>
        </div>

        {/* Destination Image */}
        <div className="relative min-h-[210px] sm:min-h-full">
          <DestinationImage
            src="/images/explore/amalfi.jpg"
            alt="Amalfi Coast, Italy"
            className="absolute inset-0 h-full w-full"
            imageClassName="object-cover transition-transform duration-700 hover:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#070B18] via-[#070B18]/25 to-transparent sm:from-[#070B18]/80" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#070B18]/60 to-transparent sm:hidden" />
        </div>
      </div>
    </article>
  );
}