import {
  Bolt,
  Hotel,
  PlaneTakeoff,
  ShieldCheck,
} from "lucide-react";

const items = [
  {
    icon:
      PlaneTakeoff,

    text:
      "Smart Flight Analysis",
  },

  {
    icon:
      Hotel,

    text:
      "Hotel Intelligence",
  },

  {
    icon:
      Bolt,

    text:
      "AI Trip Optimization",
  },

  {
    icon:
      ShieldCheck,

    text:
      "Secure Planning",
  },
];

export default function LandingTrustBar() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-5 px-4 py-5 md:grid-cols-4 md:px-6">
        {items.map(
          (item) => {
            const Icon =
              item.icon;

            return (
              <div
                key={
                  item.text
                }
                className="flex items-center justify-center gap-2 text-center text-xs font-medium text-[#948e9c]"
              >
                <Icon
                  size={15}
                  className="shrink-0 text-[#d1bcff]"
                />

                {
                  item.text
                }
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}