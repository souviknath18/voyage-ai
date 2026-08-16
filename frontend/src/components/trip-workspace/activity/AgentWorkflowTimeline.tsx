import {
  Activity,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

import type {
  AgentActivityEvent,
} from "@/types/trip-workspace";

import AgentWorkflowItem from "./AgentWorkflowItem";

interface AgentWorkflowTimelineProps {
  events:
    AgentActivityEvent[];
}

export default function AgentWorkflowTimeline({
  events,
}: AgentWorkflowTimelineProps) {
  return (
    <Card className="p-4 sm:p-5">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-4">
        <Activity
          size={17}
          className="text-[#fb7185]"
        />

        <div>
          <h2 className="text-base font-semibold text-[#e6e0e8]">
            Agent Workflow
          </h2>

          <p className="mt-0.5 text-xs text-[#7f8798]">
            Observable actions performed while VoyageAI builds and updates your trip.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        {events.map(
          (
            event,
            index,
          ) => (
            <AgentWorkflowItem
              key={
                event.id
              }
              event={
                event
              }
              last={
                index ===
                events.length - 1
              }
            />
          ),
        )}
      </div>
    </Card>
  );
}