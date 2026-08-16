import {
  CheckCircle2,
  Clock3,
  Cpu,
  Zap,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

interface ActivitySummaryProps {
  runId: string;

  elapsedTime: string;

  completedSteps: number;

  totalSteps: number;

  status:
    | "running"
    | "completed"
    | "failed";
}

export default function ActivitySummary({
  runId,
  elapsedTime,
  completedSteps,
  totalSteps,
  status,
}: ActivitySummaryProps) {
  const progress =
    totalSteps > 0
      ? Math.round(
          (completedSteps /
            totalSteps) *
            100,
        )
      : 0;

  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryItem
          icon={Cpu}
          label="Run ID"
          value={runId}
        />

        <SummaryItem
          icon={Clock3}
          label="Elapsed"
          value={elapsedTime}
          accent="violet"
        />

        <SummaryItem
          icon={CheckCircle2}
          label="Completed"
          value={`${completedSteps}/${totalSteps}`}
          accent="green"
        />

        <SummaryItem
          icon={Zap}
          label="Status"
          value={
            status ===
            "running"
              ? "Processing"
              : status ===
                  "completed"
                ? "Completed"
                : "Failed"
          }
          accent={
            status ===
            "running"
              ? "amber"
              : status ===
                  "completed"
                ? "green"
                : "coral"
          }
        />
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] text-[#7f8798]">
            Agent workflow progress
          </span>

          <span className="text-[10px] font-semibold text-[#fb7185]">
            {progress}%
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d] transition-[width] duration-700"
            style={{
              width: `${Math.min(
                progress,
                100,
              )}%`,
            }}
          />
        </div>
      </div>
    </Card>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{
    size?: number;
  }>;

  label: string;

  value: string;

  accent?:
    | "violet"
    | "amber"
    | "green"
    | "coral";
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[#7f8798]">
        <Icon size={13} />

        <span className="text-[9px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p
        className={`mt-1.5 truncate text-sm font-semibold sm:text-base ${
          accent === "violet"
            ? "text-[#d1bcff]"
            : accent === "amber"
              ? "text-[#fcd34d]"
              : accent === "green"
                ? "text-emerald-400"
                : accent === "coral"
                  ? "text-[#fb7185]"
                  : "text-[#e6e0e8]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}