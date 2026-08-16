"use client";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Button,
} from "@/components/ui";

export default function LandingCTA() {
  const router =
    useRouter();

  return (
    <section className="px-4 py-20 md:px-6 md:py-24">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-12 text-center sm:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#fb7185]/10 blur-[100px]" />

        <div className="relative">
          <Sparkles
            size={20}
            className="mx-auto text-[#fcd34d]"
          />

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#e6e0e8] sm:text-3xl">
            Ready to plan your next journey?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#948e9c]">
            Tell VoyageAI what you have in mind and let the agent build the journey around you.
          </p>

          <div className="mt-6">
            <Button
              size="md"
              onClick={() =>
                router.push(
                  "/signup",
                )
              }
            >
              Start Planning

              <ArrowRight
                size={15}
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}