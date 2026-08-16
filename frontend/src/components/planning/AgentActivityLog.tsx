"use client";

import {
  Cpu,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

import type {
  PlanningStep,
} from "@/types/planning";

import AgentActivityItem from "./AgentActivityItem";

interface AgentActivityLogProps {
  steps: PlanningStep[];
}

export default function AgentActivityLog({
  steps,
}: AgentActivityLogProps) {
  return (
    <Card className="p-4 sm:p-5">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Cpu
            size={18}
            className="text-[#fb7185]"
          />

          <div>
            <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
              Agent Activity
            </h2>

            <p className="mt-0.5 text-xs text-[#7f8798]">
              Observable actions
              performed by VoyageAI.
            </p>
          </div>
        </div>

        {/* Service health */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#948e9c]">
          <ServiceStatus label="AI Engine" />

          <ServiceStatus label="Travel APIs" />
        </div>
      </div>

      {/* Timeline */}
      <div>
        {steps.map(
          (step, index) => (
            <AgentActivityItem
              key={step.id}
              step={step}
              last={
                index ===
                steps.length - 1
              }
            />
          ),
        )}
      </div>
    </Card>
  );
}

function ServiceStatus({
  label,
}: {
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

      {label}: Online
    </span>
  );
}