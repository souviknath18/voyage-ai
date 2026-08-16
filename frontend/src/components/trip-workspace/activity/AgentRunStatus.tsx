"use client";

import {
  CheckCircle2,
  LoaderCircle,
  XCircle,
} from "lucide-react";

interface AgentRunStatusProps {
  status:
    | "running"
    | "completed"
    | "failed";
}

export default function AgentRunStatus({
  status,
}: AgentRunStatusProps) {
  if (
    status === "running"
  ) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-[#fcd34d]/20 bg-[#fcd34d]/[0.06] px-3 py-1.5 text-[10px] font-semibold text-[#fcd34d]">
        <LoaderCircle
          size={12}
          className="animate-spin"
        />

        Agent Running
      </div>
    );
  }

  if (
    status === "completed"
  ) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-semibold text-emerald-400">
        <CheckCircle2
          size={12}
        />

        Completed
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/[0.06] px-3 py-1.5 text-[10px] font-semibold text-red-400">
      <XCircle size={12} />

      Failed
    </div>
  );
}