"use client";

import type {
  GlobalAgentRun,
} from "@/types/agent-activity";

import AgentRunListItem from "./AgentRunListItem";

interface AgentRunListProps {
  runs: GlobalAgentRun[];

  selectedRunId: string;

  onSelectAction: (
    id: string,
  ) => void;
}

export default function AgentRunList({
  runs,
  selectedRunId,
  onSelectAction,
}: AgentRunListProps) {
  return (
    <aside className="space-y-3">
      <p className="px-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7f8798]">
        Recent Runs
      </p>

      <div className="max-h-[720px] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
        {runs.map(
          (run) => (
            <AgentRunListItem
              key={run.id}
              run={run}
              active={
                selectedRunId ===
                run.id
              }
              onClickAction={() =>
                onSelectAction(
                  run.id,
                )
              }
            />
          ),
        )}
      </div>
    </aside>
  );
}