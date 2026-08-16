"use client";

import {
  Sparkles,
} from "lucide-react";

import {
  Button,
  Card,
} from "@/components/ui";

interface BudgetOptimizationCardProps {
  currency: string;

  potentialSavings: number;

  recommendationCount: number;

  onOptimizeAction: () => void;
}

export default function BudgetOptimizationCard({
  currency,
  potentialSavings,
  recommendationCount,
  onOptimizeAction,
}: BudgetOptimizationCardProps) {
  return (
    <Card className="relative flex h-full flex-col items-center justify-center overflow-hidden p-5 text-center">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fb7185]/[0.06] via-transparent to-[#fcd34d]/[0.04]" />

      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185] shadow-[0_0_25px_rgba(251,113,133,0.12)]">
        <Sparkles size={24} />
      </div>

      <h2 className="relative z-10 mt-4 text-base font-semibold text-[#e6e0e8]">
        AI Budget Optimization
      </h2>

      <p className="relative z-10 mt-2 max-w-xs text-xs leading-5 text-[#948e9c]">
        VoyageAI found{" "}
        {recommendationCount}{" "}
        possible adjustments that could save up to{" "}
        <span className="font-semibold text-[#fb7185]">
          {currency}{" "}
          {potentialSavings.toLocaleString()}
        </span>{" "}
        while preserving your core trip experience.
      </p>

      <Button
        fullWidth
        size="sm"
        onClick={onOptimizeAction}
        className="relative z-10 mt-5"
      >
        <Sparkles size={14} />

        Optimize My Budget
      </Button>
    </Card>
  );
}