import {
  Bot,
  Hotel,
  Map,
  Plane,
  Sparkles,
  WalletCards,
} from "lucide-react";

const features = [
  {
    icon:
      Sparkles,

    title:
      "AI Itinerary Planning",

    description:
      "Generate personalized multi-day trips built around your preferences.",
  },

  {
    icon:
      Plane,

    title:
      "Flight Intelligence",

    description:
      "Compare travel options while considering budget and itinerary impact.",
  },

  {
    icon:
      Hotel,

    title:
      "Hotel Comparison",

    description:
      "Evaluate stays based on location, price and your planned activities.",
  },

  {
    icon:
      WalletCards,

    title:
      "Budget Optimization",

    description:
      "Keep your entire trip aligned with the budget you actually want to spend.",
  },

  {
    icon:
      Map,

    title:
      "Smart Places",

    description:
      "Discover and organize places that naturally fit into your itinerary.",
  },

  {
    icon:
      Bot,

    title:
      "Trip-Aware Assistant",

    description:
      "Ask VoyageAI questions or request changes without leaving your trip workspace.",
  },
];

export default function LandingFeatures() {
  return (
    <section
      id="features"
      className="px-4 py-20 md:px-6 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#fb7185]">
            VoyageAI Intelligence
          </span>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#e6e0e8] sm:text-3xl">
            Everything your trip needs,
            <br />
            coordinated by AI.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(
            (feature) => {
              const Icon =
                feature.icon;

              return (
                <article
                  key={
                    feature.title
                  }
                  className="group rounded-xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-[#fb7185]/20 hover:bg-white/[0.04]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#d1bcff] transition group-hover:text-[#fb7185]">
                    <Icon
                      size={17}
                    />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-[#e6e0e8]">
                    {
                      feature.title
                    }
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#948e9c]">
                    {
                      feature.description
                    }
                  </p>
                </article>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}