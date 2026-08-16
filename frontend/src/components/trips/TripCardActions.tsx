"use client";

import Link from "next/link";

import {
  Copy,
  Edit3,
  Eye,
  Share2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui";

import type {
  TripListItem,
} from "@/types/trips";

interface TripCardActionsProps {
  trip: TripListItem;
}

export default function TripCardActions({
  trip,
}: TripCardActionsProps) {
  if (
    trip.status === "draft"
  ) {
    return (
      <Link
        href={`/plan-trip?draft=${trip.id}`}
        className="block w-full"
      >
        <Button
          variant="outline"
          fullWidth
          size="sm"
        >
          <Edit3 size={14} />
          Continue Planning
        </Button>
      </Link>
    );
  }

  return (
    <div className="space-y-2">
      <Link
        href={`/trips/${trip.id}`}
        className="block w-full"
      >
        <Button
          fullWidth
          size="sm"
        >
          <Eye size={14} />
          View Itinerary
        </Button>
      </Link>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth
        >
          <Share2 size={13} />
          Share
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth
        >
          <Copy size={13} />
          Duplicate
        </Button>
      </div>
    </div>
  );
}