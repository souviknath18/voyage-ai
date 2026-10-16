
import { CalendarDays, MapPin, Wallet } from "lucide-react";

import type { ExploreDestinationApi } from "@/types/explore";

export default function DestinationTravelContext({
  destination,
}: {
  destination: ExploreDestinationApi;
}) {
  const items = [
    {
      icon: Wallet,
      title: "Daily Budget",
      value: "Verified estimate unavailable",
      accent: "text-[#fcd34d]",
    },
    {
      icon: CalendarDays,
      title: "Best Time to Visit",
      value: "Seasonal guidance unavailable",
      accent: "text-[#fb7185]",
    },
    {
      icon: MapPin,
      title: "Coordinates",
      value: `${destination.latitude.toFixed(3)}, ${destination.longitude.toFixed(3)}`,
      accent: "text-[#d1bcff]",
    },
  ];

  return (
    <aside className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-6">
      <h2 className="border-b border-white/10 pb-4 text-base font-semibold text-[#e6e0e8] sm:text-lg">
        Travel Context
      </h2>

      <div className="mt-5 space-y-5">
        {items.map(({ icon: Icon, title, value, accent }) => (
          <div key={title} className="flex items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] ${accent}`}
            >
              <Icon size={17} />
            </div>

            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-[#e6e0e8]">
                {title}
              </h3>

              <p className="mt-1 break-words text-xs leading-5 text-[#948e9c]">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}