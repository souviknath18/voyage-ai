"use client";

import {
  Bookmark,
  CheckCircle2,
  Clock3,
  FilePenLine,
} from "lucide-react";

import type {
  TripTab,
} from "@/types/trips";

interface TripTabsProps {
  activeTab: TripTab;

  counts: Record<
    TripTab,
    number
  >;

  onChangeAction: (
    tab: TripTab,
  ) => void;
}

const tabs = [
  {
    value: "upcoming" as TripTab,
    label: "Upcoming",
    icon: Clock3,
  },
  {
    value: "draft" as TripTab,
    label: "Drafts",
    icon: FilePenLine,
  },
  {
    value: "completed" as TripTab,
    label: "Completed",
    icon: CheckCircle2,
  },
  {
    value: "saved" as TripTab,
    label: "Saved",
    icon: Bookmark,
  },
];

export default function TripTabs({
  activeTab,
  counts,
  onChangeAction,
}: TripTabsProps) {
  return (
    <div className="overflow-x-auto border-b border-white/10 [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="flex min-w-max items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          const active =
            activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                onChangeAction(
                  tab.value,
                )
              }
              className={`relative flex items-center gap-2 px-3 py-3 text-sm font-medium transition ${
                active
                  ? "text-[#fb7185]"
                  : "text-[#948e9c] hover:text-[#cbc4d2]"
              }`}
            >
              <Icon size={15} />

              {tab.label}

              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  active
                    ? "bg-[#fb7185]/15 text-[#fb7185]"
                    : "bg-white/[0.05] text-[#7f8798]"
                }`}
              >
                {counts[
                  tab.value
                ]}
              </span>

              {active && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#fb7185]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}