"use client";

import {
  Plus,
} from "lucide-react";

interface AddActivityButtonProps {
  dayNumber: number;

  onAddAction: (
    dayNumber: number,
  ) => void;
}

export default function AddActivityButton({
  dayNumber,
  onAddAction,
}: AddActivityButtonProps) {
  return (
    <button
      type="button"
      onClick={() =>
        onAddAction(dayNumber)
      }
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3 text-xs font-medium text-[#948e9c] transition hover:border-[#d1bcff]/30 hover:bg-white/[0.05] hover:text-[#e6e0e8]"
    >
      <Plus size={15} />

      Add Activity to Day{" "}
      {dayNumber}
    </button>
  );
}