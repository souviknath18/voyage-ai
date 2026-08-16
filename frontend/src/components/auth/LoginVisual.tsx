import {
  Bot,
  CloudMoon,
  Plane,
  Sparkles,
} from "lucide-react";

import {
  DestinationImage,
} from "@/components/ui";

export default function LoginVisual() {
  return (
    <section className="relative hidden min-h-dvh overflow-hidden lg:block">
      {/* Background Image */}
      <div className="absolute inset-0">
        <DestinationImage
          src="/images/trips/tokyo.jpg"
          alt="Tokyo travel experience"
          className="h-full w-full"
          imageClassName="object-cover object-center"
        />
      </div>

      {/* Image overlays */}
      <div className="absolute inset-0 bg-black/15" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1F] via-[#0A0F1F]/40 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#070B18]/75 via-transparent to-[#070B18]/20" />

      {/* Ambient Glow */}
      <div className="pointer-events-none absolute right-[15%] top-[20%] h-80 w-80 rounded-full bg-[#fb7185]/10 blur-[100px]" />

      {/* Floating Cards */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-10">
        <div className="w-full max-w-[520px]">
          {/* Flight Card */}
          <div className="relative rounded-2xl border border-white/15 bg-[#0D1324]/80 p-5 shadow-[0_22px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex rounded-md border border-[#fb7185]/20 bg-[#fb7185]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#fb7185]">
                  Upcoming Flight
                </span>

                <h2 className="mt-3 text-xl font-semibold text-[#e6e0e8]">
                  Tokyo • NRT
                </h2>

                <p className="mt-1 text-xs text-[#948e9c]">
                  Tomorrow, 19:45
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#fb7185]">
                <Plane
                  size={18}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d]" />
              </div>

              <span className="text-[10px] font-semibold uppercase text-[#fcd34d]">
                On Time
              </span>
            </div>
          </div>

          {/* Bottom cards */}
          <div className="mt-5 grid grid-cols-12 gap-4">
            {/* AI Insight */}
            <div className="col-span-7 rounded-2xl border border-white/15 bg-[#0D1324]/80 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[#d1bcff]">
                <Bot
                  size={14}
                />

                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Concierge Insight
                </span>
              </div>

              <p className="mt-3 text-xs leading-5 text-[#cbc4d2]">
                Your dinner reservation is confirmed and your airport transfer is ready.
              </p>
            </div>

            {/* Weather */}
            <div className="col-span-5 flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-[#0D1324]/80 p-4 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <CloudMoon
                size={26}
                className="text-[#fcd34d]"
              />

              <p className="mt-2 text-lg font-semibold text-[#e6e0e8]">
                18°C
              </p>

              <p className="text-[11px] text-[#948e9c]">
                Clear
              </p>
            </div>
          </div>

          {/* AI status */}
          <div className="mt-5 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#070B18]/60 px-3 py-2 backdrop-blur-xl">
              <Sparkles
                size={12}
                className="text-[#fb7185]"
              />

              <span className="text-[11px] text-[#cbc4d2]">
                VoyageAI is ready for your next journey
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <p className="absolute bottom-8 left-0 right-0 z-10 text-center text-sm italic text-white/70">
        &ldquo;The world is waiting.&rdquo;
      </p>
    </section>
  );
}