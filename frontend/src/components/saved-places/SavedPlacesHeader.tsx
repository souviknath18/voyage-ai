"use client";

import {
  Bookmark,
  Search,
} from "lucide-react";

import {
  Input,
} from "@/components/ui";

interface SavedPlacesHeaderProps {
  search: string;

  onSearchChangeAction: (
    value: string,
  ) => void;
}

export default function SavedPlacesHeader({
  search,
  onSearchChangeAction,
}: SavedPlacesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pt-2.5 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
      <div>
        {/* Icon + Title */}
        <div className="flex items-center gap-2">
          <Bookmark
            size={19}
            className="text-[#fb7185]"
          />

          <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
            Saved Places
          </h1>
        </div>

        <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#948e9c]">
          Keep your favorite destinations and experiences ready for future trips.
        </p>
      </div>

      {/* Search */}
      <div className="w-full sm:w-64">
        <Input
          value={search}
          onChange={(event) =>
            onSearchChangeAction(
              event.target.value,
            )
          }
          placeholder="Search saved places..."
          leftIcon={
            <Search size={15} />
          }
        />
      </div>
    </div>
  );
}