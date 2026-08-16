"use client";

import Link from "next/link";

import {
  Bot,
  Map,
  MapPin,
  Receipt,
  Route,
  Sparkles,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

interface TripWorkspaceTabsProps {
  tripId: string;
}

const tabs = [
  {
    value: "overview",
    label: "Overview",
    icon: Sparkles,
  },
  {
    value: "itinerary",
    label: "Itinerary",
    icon: Route,
  },
  {
    value: "budget",
    label: "Budget",
    icon: Receipt,
  },
  {
    value: "places",
    label: "Places",
    icon: MapPin,
  },
  {
    value: "map",
    label: "Map",
    icon: Map,
  },
  {
    value: "agent-activity",
    label: "AI Activity",
    icon: Bot,
  },
];

export default function TripWorkspaceTabs({
  tripId,
}: TripWorkspaceTabsProps) {
  const pathname =
    usePathname();

  const basePath =
    `/trips/${tripId}`;

  return (
    <div className="overflow-x-auto border-b border-white/10 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="flex min-w-max gap-1">
        {tabs.map((tab) => {
          const Icon =
            tab.icon;

          const href =
            tab.value ===
            "overview"
              ? basePath
              : `${basePath}/${tab.value}`;

          const active =
            tab.value ===
            "overview"
              ? pathname ===
                basePath
              : pathname ===
                  href ||
                pathname.startsWith(
                  `${href}/`,
                );

          return (
            <Link
              key={tab.value}
              href={href}
              className={`relative flex items-center gap-2 px-3 py-3 text-sm font-medium transition ${
                active
                  ? "text-[#fb7185]"
                  : "text-[#948e9c] hover:text-[#cbc4d2]"
              }`}
            >
              <Icon size={15} />

              {tab.label}

              {active && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#fb7185]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}