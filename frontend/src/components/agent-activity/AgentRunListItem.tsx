"use client";

import {
  CheckCircle2,
  LoaderCircle,
  XCircle,
} from "lucide-react";

import type {
  GlobalAgentRun,
} from "@/types/agent-activity";

interface AgentRunListItemProps {
  run: GlobalAgentRun;

  active: boolean;

  onClickAction: () => void;
}

export default function AgentRunListItem({
  run,
  active,
  onClickAction,
}: AgentRunListItemProps) {
  const StatusIcon =
    run.status ===
    "running"
      ? LoaderCircle
      : run.status ===
          "completed"
        ? CheckCircle2
        : XCircle;

  return (
    <button
      type="button"
      onClick={onClickAction}
      className={`w-full rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#fb7185]/30 bg-[#fb7185]/[0.06]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${
            active
              ? "text-[#fcd34d]"
              : "text-[#7f8798]"
          }`}
        >
          {run.id}
        </span>

        <span className="shrink-0 text-[10px] text-[#7f8798]">
          {run.createdAt}
        </span>
      </div>

      <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-[#e6e0e8]">
        {run.title}
      </h3>

      <p className="mt-1 text-xs text-[#948e9c]">
        {run.destination}
      </p>

      <div
        className={`mt-3 flex items-center gap-1.5 text-xs ${
          run.status ===
          "running"
            ? "text-[#fcd34d]"
            : run.status ===
                "completed"
              ? "text-emerald-400"
              : "text-red-400"
        }`}
      >
        <StatusIcon
          size={13}
          className={
            run.status ===
            "running"
              ? "animate-spin"
              : ""
          }
        />

        {run.status ===
        "running"
          ? "Processing..."
          : run.status ===
              "completed"
            ? "Completed"
            : "Failed"}
      </div>
    </button>
  );
}