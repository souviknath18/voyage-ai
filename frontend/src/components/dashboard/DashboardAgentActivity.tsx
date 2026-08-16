import {
  Car,
  Lightbulb,
  Utensils,
} from "lucide-react";

const activities = [
  {
    id: "1",

    title:
      "Dinner Reservation Secured",

    description:
      "Gion Maruyama, Kyoto • 2h ago",

    icon:
      Utensils,

    style:
      "border-[#d1bcff]/20 bg-[#d1bcff]/10 text-[#d1bcff]",
  },

  {
    id: "2",

    title:
      "Airport Transfer Updated",

    description:
      "Private SUV confirmed • 5h ago",

    icon:
      Car,

    style:
      "border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]",
  },

  {
    id: "3",

    title:
      "New Itinerary Suggestion",

    description:
      "Added Arashiyama Bamboo Grove • 1d ago",

    icon:
      Lightbulb,

    style:
      "border-[#fcd34d]/20 bg-[#fcd34d]/10 text-[#fcd34d]",
  },
];

export default function DashboardAgentActivity() {
  return (
    <article className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Concierge Activity
        </h2>

        <span className="text-[10px] font-medium text-[#7f8798]">
          Recent
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {activities.map(
          (activity) => {
            const Icon =
              activity.icon;

            return (
              <div
                key={
                  activity.id
                }
                className="flex items-start gap-3"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${activity.style}`}
                >
                  <Icon
                    size={13}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium leading-5 text-[#e6e0e8]">
                    {
                      activity.title
                    }
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-[#7f8798]">
                    {
                      activity.description
                    }
                  </p>
                </div>
              </div>
            );
          },
        )}
      </div>
    </article>
  );
}