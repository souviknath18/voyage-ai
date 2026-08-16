"use client";

import {
  Bot,
} from "lucide-react";

import type {
  AgentRunData,
} from "@/types/trip-workspace";

import ActivitySummary from "./ActivitySummary";
import AgentRunStatus from "./AgentRunStatus";
import AgentWorkflowTimeline from "./AgentWorkflowTimeline";

interface TripAIActivityProps {
  run: AgentRunData;
}

export default function TripAIActivity({
  run,
}: TripAIActivityProps) {
  return (
    <div className="space-y-5">
      {/* Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot
              size={19}
              className="text-[#fb7185]"
            />

            <h2 className="text-lg font-semibold text-[#e6e0e8] sm:text-xl">
              AI Activity
            </h2>
          </div>

          <p className="mt-1 max-w-2xl text-sm leading-5 text-[#948e9c]">
            See how VoyageAI searched, validated and optimized this trip.
          </p>
        </div>

        <AgentRunStatus
          status={
            run.status
          }
        />
      </div>

      {/* Summary */}
      <ActivitySummary
        runId={run.id}
        elapsedTime={
          run.elapsedTime
        }
        completedSteps={
          run.completedSteps
        }
        totalSteps={
          run.totalSteps
        }
        status={
          run.status
        }
      />

      {/* Workflow */}
      <AgentWorkflowTimeline
        events={
          run.events
        }
      />
    </div>
  );
}