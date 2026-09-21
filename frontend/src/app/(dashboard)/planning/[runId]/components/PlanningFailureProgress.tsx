"use client";

import {
  Check,
  X,
} from "lucide-react";

import type {
  PlanningStep,
} from "@/types/planning";

interface PlanningFailureProgressProps {
  steps: PlanningStep[];
}

export default function PlanningFailureProgress({
  steps,
}: PlanningFailureProgressProps) {
  return (
    <div className="h-full rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f8798]">
        Planning Progress
      </p>

      <div className="mt-4">
        {steps.map((step, index) => (
          <ProgressItem
            key={step.id}
            step={step}
            last={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function ProgressItem({
  step,
  last,
}: {
  step: PlanningStep;
  last: boolean;
}) {
  const failed =
    step.status === "failed";

  const completed =
    step.status === "completed";

  return (
    <div className="relative flex gap-3">
      <div className="relative flex shrink-0 flex-col items-center">
        <div className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border ${completed ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400" : failed ? "border-[#fb7185]/50 bg-[#fb7185]/10 text-[#fb7185] shadow-[0_0_12px_rgba(251,113,133,0.18)]" : "border-white/10 bg-white/[0.03] text-[#596174]"}`}>
          {completed && (
            <Check size={12} />
          )}

          {failed && (
            <X size={12} />
          )}
        </div>

        {!last && (
          <div className="absolute bottom-0 top-6 w-px bg-white/10" />
        )}
      </div>

      <div className="min-w-0 flex-1 pb-4">
        <p className={`text-xs font-medium sm:text-[13px] ${failed ? "text-[#fb7185]" : completed ? "text-[#e6e0e8]" : "text-[#7f8798]"}`}>
          {step.title}
        </p>

        {step.description && (
          <p className="mt-0.5 text-[11px] leading-4 text-[#7f8798]">
            {step.description}
          </p>
        )}

        {step.children && step.children.length > 0 && (
          <div className="mt-2 space-y-1.5 border-l border-white/10 pl-3">
            {step.children.map((child) => (
              <div key={child.id} className="flex items-center gap-2 text-[11px]">
                {child.status === "completed" ? (
                  <Check size={11} className="shrink-0 text-emerald-400" />
                ) : child.status === "failed" ? (
                  <X size={11} className="shrink-0 text-[#fb7185]" />
                ) : (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#596174]" />
                )}

                <span className={child.status === "failed" ? "text-[#fb7185]" : "text-[#948e9c]"}>
                  {child.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}