import Link from "next/link";

import {
  Map,
  Plus,
} from "lucide-react";

import {
  Button,
  Card,
} from "@/components/ui";

import type {
  TripTab,
} from "@/types/trips";

interface TripEmptyStateProps {
  tab: TripTab;
}

const messages: Record<
  TripTab,
  {
    title: string;
    description: string;
  }
> = {
  upcoming: {
    title:
      "No upcoming trips",
    description:
      "Plan your next adventure and VoyageAI will help build your itinerary.",
  },

  draft: {
    title:
      "No trip drafts",
    description:
      "Trips you start planning but don't finish will appear here.",
  },

  completed: {
    title:
      "No completed trips",
    description:
      "Your completed journeys will appear here.",
  },

  saved: {
    title:
      "No saved trips",
    description:
      "Save interesting trip ideas so you can return to them later.",
  },
};

export default function TripEmptyState({
  tab,
}: TripEmptyStateProps) {
  const message =
    messages[tab];

  return (
    <Card className="col-span-full flex flex-col items-center justify-center px-4 py-14 text-center sm:py-20">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d1bcff]/10 text-[#d1bcff]">
        <Map size={22} />
      </div>

      <h2 className="mt-4 text-base font-semibold text-[#e6e0e8] sm:text-lg">
        {message.title}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-[#948e9c]">
        {message.description}
      </p>

      {tab === "upcoming" && (
        <Link
          href="/plan-trip"
          className="mt-5"
        >
          <Button size="md">
            <Plus size={15} />

            Plan New Trip
          </Button>
        </Link>
      )}
    </Card>
  );
}