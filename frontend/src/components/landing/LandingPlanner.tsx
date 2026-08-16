"use client";

import {
  CalendarDays,
  Search,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function LandingPlanner() {
  const router =
    useRouter();

  const [
    prompt,
    setPrompt,
  ] = useState("");

  const handleGenerate =
    () => {
      router.push(
        "/plan-trip",
      );
    };

  return (
    <section className="px-4 py-20 md:px-6 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#fb7185]">
            AI Trip Planner
          </span>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#e6e0e8] sm:text-3xl">
            Start with a thought.
            <br />
            We handle the rest.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#948e9c]">
            Tell VoyageAI what kind of trip you want. The AI planner can research, organize and optimize the journey around you.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col gap-4 rounded-xl bg-[#0D1324] p-4 sm:p-5 md:flex-row md:items-end">
            {/* Destination */}
            <div className="flex-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#fb7185]">
                Destination or vibe
              </label>

              <div className="mt-2 flex items-center gap-2 border-b border-white/10 pb-2.5">
                <Search
                  size={15}
                  className="text-[#7f8798]"
                />

                <input
                  value={
                    prompt
                  }
                  onChange={(
                    event,
                  ) =>
                    setPrompt(
                      event.target
                        .value,
                    )
                  }
                  placeholder="A relaxing week in Kyoto for two..."
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#e6e0e8] outline-none placeholder:text-[#596174]"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="md:w-48">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#fcd34d]">
                Dates
              </label>

              <div className="mt-2 flex items-center gap-2 border-b border-white/10 pb-2.5 text-sm text-[#cbc4d2]">
                <CalendarDays
                  size={15}
                  className="text-[#7f8798]"
                />

                Flexible
              </div>
            </div>

            {/* Generate */}
            <button
              type="button"
              onClick={
                handleGenerate
              }
              className="flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#fb7185] to-[#fcd34d] text-[#070B18] transition hover:opacity-90 md:w-11"
            >
              <Sparkles
                size={16}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}