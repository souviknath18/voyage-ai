"use client";

import { CalendarDays } from "lucide-react";

interface DateInputProps {
  value: string;
  onChangeAction: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
}

export default function DateInput({
  value,
  onChangeAction,
  min,
  max,
  disabled = false,
}: DateInputProps) {
  return (
    <div className="relative w-full">
      <CalendarDays
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#948e9c]"
      />

      <input
        type="date"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(event) =>
          onChangeAction(event.target.value)
        }
        className="h-[46px] w-full min-w-0 rounded-lg border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-[#e6e0e8] outline-none transition focus:border-[#d1bcff]/60 focus:ring-2 focus:ring-[#d1bcff]/10 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}