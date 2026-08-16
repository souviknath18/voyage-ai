import {
  PlaneTakeoff,
  Sparkles,
} from "lucide-react";

import {
  DestinationImage,
} from "@/components/ui";

export default function SignupVisual() {
  return (
    <section className="relative hidden min-h-dvh overflow-hidden lg:block">
      {/* Background */}
      <div className="absolute inset-0">
        <DestinationImage
          src="/images/trips/tokyo.jpg"
          alt="VoyageAI intelligent travel planning"
          className="h-full w-full"
          imageClassName="object-cover object-center"
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/15" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1F] via-[#0A0F1F]/30 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#070B18]/80 via-transparent to-[#070B18]/20" />

      {/* Small Badge */}
      <div className="absolute right-8 top-8 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-[#070B18]/55 px-3 py-2 backdrop-blur-xl">
        <Sparkles
          size={12}
          className="text-[#fb7185]"
        />

        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#cbc4d2]">
          Agentic Travel Planning
        </span>
      </div>

      {/* Insight Card */}
      <div className="absolute bottom-10 left-8 right-8 z-10 xl:bottom-14 xl:left-12 xl:right-12">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0D1324]/80 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          {/* Accent */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#fb7185] via-[#fcd34d] to-transparent" />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[#fcd34d]">
              <PlaneTakeoff
                size={18}
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#e6e0e8]">
                Intelligent Itineraries
              </h2>

              <p className="mt-1.5 max-w-lg text-sm leading-6 text-[#cbc4d2]">
                VoyageAI understands your destination, budget, interests and travel style to build a trip that adapts around you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}