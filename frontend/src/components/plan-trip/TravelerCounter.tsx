"use client";

import {
  Minus,
  Plus,
  Users,
} from "lucide-react";

interface TravelerCounterProps {
  value: number;
  onChangeAction: (value: number) => void;
}

export default function TravelerCounter({
  value,
  onChangeAction,
}: TravelerCounterProps) {
  const decrease = () => {
    if (value > 1) {
      onChangeAction(value - 1);
    }
  };

  const increase = () => {
    onChangeAction(value + 1);
  };

  return (
    <div className="w-full">
      {/* Label */}
      <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
        Travelers
      </label>

      {/* Counter */}
      <div className="flex h-[46px] w-full items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
        {/* Decrease */}
        <button
          type="button"
          onClick={decrease}
          disabled={value <= 1}
          className="flex h-full w-11 shrink-0 items-center justify-center text-[#cbc4d2] transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus size={16} />
        </button>

        {/* Traveler Count */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 text-[#e6e0e8]">
          <Users
            size={16}
            className="shrink-0 text-[#d1bcff]"
          />

          <span className="text-sm font-semibold">
            {value}
          </span>
        </div>

        {/* Increase */}
        <button
          type="button"
          onClick={increase}
          className="flex h-full w-11 shrink-0 items-center justify-center text-[#cbc4d2] transition hover:bg-white/[0.06] hover:text-white"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}