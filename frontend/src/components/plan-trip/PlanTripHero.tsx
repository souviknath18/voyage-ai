import {
  PlaneTakeoff,
} from "lucide-react";

export default function PlanTripHero() {
  return (
    <section className="relative w-full pb-4 pt-2.5 sm:pt-3">
      {/* Content */}
      <div className="relative z-10">
        {/* Icon + Title */}
        <div className="flex items-center gap-2">
          <PlaneTakeoff
            size={19}
            className="text-[#fb7185]"
          />

          <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
            Design Your Expedition
          </h1>
        </div>

        <p className="mt-1.5 max-w-xl text-sm leading-5 text-[#948e9c]">
          Tell us your vision, and VoyageAI will craft a
          personalized itinerary around your destination,
          budget, interests and travel preferences.
        </p>
      </div>
    </section>
  );
}