"use client";

import { Cpu } from "lucide-react";

import { Card } from "@/components/ui";

import type { PlanningStep } from "@/types/planning";

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
          <Cpu size={18} className="text-[#fb7185]" />

          <div>
            <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
              Agent Activity
            </h2>

            <p className="mt-0.5 text-xs text-[#7f8798]">
              Observable actions performed by VoyageAI.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        {steps.map((step, index) => (
          <div key={step.id}>
            <AgentActivityItem
              step={step}
              last={
                index === steps.length - 1 &&
                (!step.children || step.children.length === 0)
              }
            />

            {step.children && step.children.length > 0 && (
              <div className="ml-[18px] border-l border-white/10 pl-6 sm:pl-7">
                {step.children.map((child, childIndex) => (
                  <AgentActivityItem
                    key={child.id}
                    step={child}
                    last={
                      index === steps.length - 1 &&
                      childIndex === step.children!.length - 1
                    }
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}