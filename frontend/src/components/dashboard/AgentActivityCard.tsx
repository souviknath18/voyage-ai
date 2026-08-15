import { Card } from "@/components/ui";

import {
  Bot,
  Hotel,
  Plane,
  Route,
} from "lucide-react";

const activities = [
  {
    id: 1,
    icon: Plane,
    title: "Flight options analyzed",
    subtitle: "Tokyo trip • 2h ago",
    iconClass:
      "bg-[#d1bcff]/10 text-[#d1bcff] border-[#d1bcff]/20",
  },
  {
    id: 2,
    icon: Hotel,
    title: "Better hotel found",
    subtitle: "Saved ₹8,400 • 5h ago",
    iconClass:
      "bg-[#fb7185]/10 text-[#fb7185] border-[#fb7185]/20",
  },
  {
    id: 3,
    icon: Route,
    title: "Itinerary optimized",
    subtitle: "Day 3 route improved • 1d ago",
    iconClass:
      "bg-[#fcd34d]/10 text-[#fcd34d] border-[#fcd34d]/20",
  },
];

export default function AgentActivityCard() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Bot
          size={20}
          className="text-[#d1bcff]"
        />

        <h2 className="text-xl font-semibold text-[#e6e0e8]">
          Agent Activity
        </h2>
      </div>

      <div className="space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3"
            >
              <div
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  ${activity.iconClass}
                `}
              >
                <Icon size={16} />
              </div>

              <div>
                <p className="text-sm font-medium text-[#e6e0e8]">
                  {activity.title}
                </p>

                <p className="mt-1 text-xs text-[#cbc4d2]">
                  {activity.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}