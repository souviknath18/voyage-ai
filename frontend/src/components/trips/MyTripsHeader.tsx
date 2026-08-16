"use client";

import Link from "next/link";

import {
  Map,
  Plus,
  Search,
} from "lucide-react";

import {
  Button,
  Input,
} from "@/components/ui";

interface MyTripsHeaderProps {
  search: string;

  onSearchChangeAction: (
    value: string,
  ) => void;
}

export default function MyTripsHeader({
  search,
  onSearchChangeAction,
}: MyTripsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pt-2.5 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
      {/* Heading */}
      <div>
        <div className="flex items-center gap-2">
          <Map
            size={19}
            className="text-[#fb7185]"
          />

          <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
            My Trips
          </h1>
        </div>

        <p className="mt-1.5 text-sm leading-5 text-[#948e9c]">
          Manage your upcoming adventures,
          drafts and past journeys.
        </p>
      </div>

      {/* Actions */}
      <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
        {/* Search */}
        <div className="w-full sm:w-64">
          <Input
            value={search}
            onChange={(event) =>
              onSearchChangeAction(
                event.target.value,
              )
            }
            placeholder="Search trips..."
            leftIcon={
              <Search size={15} />
            }
          />
        </div>

        {/* Plan Trip */}
        <Link
          href="/plan-trip"
          className="hidden sm:block"
        >
          <Button size="md">
            <Plus size={16} />

            Plan Trip
          </Button>
        </Link>
      </div>
    </div>
  );
}