import Link from "next/link";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function PlanTripHeroCard() {
  return (
    <section className="group relative min-h-[330px] overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_40px_rgba(10,2,25,0.45)]">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage:
            "url('/images/dashboard/travel-hero.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065] via-[#141218]/60 to-transparent" />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute bottom-0 left-0 z-10 w-full p-8">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#fcd34d]">
          <Sparkles size={16} />

          AI-powered trip planning
        </div>

        <h2 className="max-w-xl text-3xl font-bold text-[#e6e0e8]">
          Design Your Next Escape
        </h2>

        <p className="mt-3 max-w-lg text-sm leading-6 text-[#cbc4d2]">
          Let VoyageAI craft a personalized itinerary
          based on your destination, budget, interests,
          and travel style.
        </p>

        <Link
          href="/plan-trip"
          className="
            voyage-gradient
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-lg
            px-6
            py-3
            font-semibold
            text-[#391e70]
            shadow-[0_8px_25px_rgba(251,113,133,0.2)]
            transition-all
            hover:-translate-y-0.5
            hover:shadow-[0_10px_30px_rgba(251,113,133,0.3)]
          "
        >
          Start Planning

          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}