"use client";

import {
  ArrowRight,
  Compass,
  Sparkles,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Button,
  DestinationImage,
} from "@/components/ui";

export default function LandingHero() {
  const router =
    useRouter();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 md:px-6 md:pb-24 md:pt-36">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#2e1065]/30 blur-[130px]" />

        <div className="absolute -right-32 top-36 h-[420px] w-[420px] rounded-full bg-[#fb7185]/[0.08] blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Content */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
            <Sparkles
              size={13}
              className="text-[#fb7185]"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#cbc4d2]">
              Agentic AI Travel Planning
            </span>
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-[#e6e0e8] sm:text-5xl lg:text-[58px] lg:leading-[1.08]">
            Your Journey,
            <br />

            <span className="bg-gradient-to-r from-[#fb7185] to-[#fcd34d] bg-clip-text text-transparent">
              Planned by Intelligence
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-[#948e9c] sm:text-lg">
            VoyageAI transforms complex travel planning into personalized itineraries built around your destination, budget, interests and pace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="md"
              onClick={() =>
                router.push(
                  "/plan-trip",
                )
              }
            >
              Plan Your Trip

              <ArrowRight
                size={15}
              />
            </Button>

            <Button
              size="md"
              variant="outline"
              onClick={() =>
                router.push(
                  "/explore",
                )
              }
            >
              <Compass
                size={15}
              />

              Explore Destinations
            </Button>
          </div>
        </div>

        {/* Visual */}
        <div className="lg:col-span-6">
          <div className="group relative min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#0D1324] shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:min-h-[500px]">
            <div className="absolute inset-0">
              <DestinationImage
                src="/images/trips/tokyo.jpg"
                alt="VoyageAI intelligent travel planning"
                className="h-full w-full"
                imageClassName="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/35 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#070B18]/20 to-transparent" />

            {/* Floating AI Card */}
            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-[#0D1324]/85 p-4 shadow-xl sm:bottom-6 sm:left-6 sm:right-auto sm:w-[330px]">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={14}
                  className="text-[#fb7185]"
                />

                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#fb7185]">
                  VoyageAI Planning
                </span>
              </div>

              <h3 className="mt-3 text-base font-semibold text-[#e6e0e8]">
                Tokyo • 6 Days
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-[#948e9c]">
                Optimizing flights, stay, itinerary and budget around your travel style.
              </p>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}