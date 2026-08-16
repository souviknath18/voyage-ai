import {
  BrainCircuit,
  CheckCircle2,
  RefreshCcw,
  Search,
  WandSparkles,
} from "lucide-react";

const steps = [
  {
    icon:
      BrainCircuit,

    number:
      "01",

    title:
      "Understand",

    description:
      "VoyageAI learns your destination, budget, interests, pace and travel preferences.",
  },

  {
    icon:
      Search,

    number:
      "02",

    title:
      "Research",

    description:
      "The agent evaluates travel options, places, timing and trip constraints.",
  },

  {
    icon:
      WandSparkles,

    number:
      "03",

    title:
      "Plan",

    description:
      "A complete itinerary is created with flights, hotels, activities and budget awareness.",
  },

  {
    icon:
      CheckCircle2,

    number:
      "04",

    title:
      "Optimize",

    description:
      "VoyageAI balances time, cost, convenience and your personal priorities.",
  },

  {
    icon:
      RefreshCcw,

    number:
      "05",

    title:
      "Adapt",

    description:
      "Ask the assistant to modify the trip whenever your plans or preferences change.",
  },
];

export default function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-4 py-20 md:px-6 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#fcd34d]">
            How VoyageAI Works
          </span>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#e6e0e8] sm:text-3xl">
            More than suggestions.
            <br />
            An AI that plans.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map(
            (step) => {
              const Icon =
                step.icon;

              return (
                <article
                  key={
                    step.number
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                      <Icon
                        size={16}
                        className="text-[#d1bcff]"
                      />
                    </div>

                    <span className="text-[10px] font-semibold text-[#596174]">
                      {
                        step.number
                      }
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-[#e6e0e8]">
                    {
                      step.title
                    }
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#948e9c]">
                    {
                      step.description
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