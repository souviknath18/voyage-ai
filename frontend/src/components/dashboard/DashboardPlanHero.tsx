"use client";

import {
  ArrowRight,
  PlaneTakeoff,
  Sparkles,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Button,
  DestinationImage,
} from "@/components/ui";

export default function DashboardPlanHero() {
  const router =
    useRouter();

  return (
    <article className="group relative min-h-[340px] overflow-hidden rounded-xl border border-white/10 bg-[#070B18] shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <DestinationImage
          src="/images/trips/tokyo.jpg"
          alt="Plan your next VoyageAI trip"
          className="h-full w-full"
          imageClassName="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>

      {/* Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/65 to-[#070B18]/10" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#070B18]/45 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[340px] flex-col justify-end p-5 sm:p-6 lg:p-7">
        {/* AI Badge */}
        <div className="flex w-fit items-center gap-1.5 rounded-full border border-[#fb7185]/20 bg-[#fb7185]/10 px-2.5 py-1">
          <Sparkles
            size={11}
            className="text-[#fb7185]"
          />

          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#fb7185]">
            Powered by VoyageAI
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Design Your Next Escape
        </h2>

        {/* Description */}
        <p className="mt-2 max-w-lg text-[13px] leading-5 text-[#cbc4d2]">
          Tell VoyageAI what you want and let the agent create a personalized trip around your budget, interests and travel style.
        </p>

        {/* Action */}
        <div className="mt-5">
          <Button
            size="md"
            onClick={() =>
              router.push(
                "/plan-trip",
              )
            }
          >
            <PlaneTakeoff
              size={14}
            />

            Start Planning

            <ArrowRight
              size={13}
            />
          </Button>
        </div>
      </div>
    </article>
  );
}