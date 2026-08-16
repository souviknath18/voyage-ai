"use client";

import type {
  LucideIcon,
} from "lucide-react";

interface OptimizationPresetCardProps {
  label: string;

  icon: LucideIcon;

  active?: boolean;

  onClickAction: () => void;
}

export default function OptimizationPresetCard({
  label,
  icon: Icon,
  active = false,
  onClickAction,
}: OptimizationPresetCardProps) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      className={`group flex min-h-[110px] flex-col items-center justify-center gap-3 rounded-xl border p-4 text-center transition-all duration-300 ${
        active
          ? "border-[#fb7185]/50 bg-[#fb7185]/10 shadow-[0_0_20px_rgba(251,113,133,0.12)]"
          : "border-white/10 bg-white/[0.04] hover:border-[#fb7185]/30 hover:bg-white/[0.07]"
      }`}
    >
      <Icon
        size={25}
        className={`transition-colors ${
          active
            ? "text-[#fb7185]"
            : "text-[#948e9c] group-hover:text-[#fb7185]"
        }`}
      />

      <span
        className={`text-xs font-semibold ${
          active
            ? "text-[#e6e0e8]"
            : "text-[#cbc4d2]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}