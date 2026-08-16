import {
  Activity,
  Clock3,
} from "lucide-react";

import {
  DestinationImage,
} from "@/components/ui";

import type {
  GlobalAgentRun,
} from "@/types/agent-activity";

interface AgentRunHeroProps {
  run: GlobalAgentRun;
}

export default function AgentRunHero({
  run,
}: AgentRunHeroProps) {
  const progress =
    run.totalSteps >
    0
      ? Math.round(
          (run.completedSteps /
            run.totalSteps) *
            100,
        )
      : 0;

  return (
    <div className="relative min-h-[200px] overflow-hidden border-b border-white/10 bg-[#070B18]">
      <DestinationImage
        src={run.image}
        alt={run.destination}
        className="absolute inset-0 h-full w-full"
        imageClassName="object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/70 to-transparent" />

      <div className="relative z-10 flex min-h-[200px] flex-col justify-end p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${
              run.status ===
              "running"
                ? "border-[#fcd34d]/30 bg-[#fcd34d]/10 text-[#fcd34d]"
                : run.status ===
                    "completed"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                  : "border-red-400/30 bg-red-400/10 text-red-400"
            }`}
          >
            {run.status ===
            "running"
              ? "Active Run"
              : run.status}
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#948e9c]">
            {run.id}
          </span>
        </div>

        <h2 className="mt-3 text-xl font-semibold text-[#e6e0e8] sm:text-2xl">
          {run.title}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#948e9c]">
          <span className="flex items-center gap-1.5">
            <Activity
              size={12}
            />

            {run.completedSteps}
            /
            {run.totalSteps} steps
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3
              size={12}
            />

            {run.elapsedTime}
          </span>
        </div>

        <div className="mt-4 max-w-lg">
          <div className="mb-1.5 flex justify-between text-[10px]">
            <span className="text-[#7f8798]">
              Workflow progress
            </span>

            <span className="font-semibold text-[#fb7185]">
              {progress}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d]"
              style={{
                width: `${Math.min(
                  progress,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}