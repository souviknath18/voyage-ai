"use client";

import {
  BedDouble,
  BrainCircuit,
  CheckCircle2,
  CloudSun,
  DollarSign,
  Hourglass,
  Landmark,
  LoaderCircle,
  Map,
  Plane,
  RefreshCcw,
  Search,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import type {
  AgentActivityEvent,
  AgentActivityType,
} from "@/types/trip-workspace";

interface AgentWorkflowItemProps {
  event: AgentActivityEvent;

  last?: boolean;
}

const activityIcons: Record<
  AgentActivityType,
  React.ComponentType<{
    size?: number;
    className?: string;
  }>
> = {
  request: Search,
  flight: Plane,
  hotel: BedDouble,
  budget: DollarSign,
  places: Landmark,
  weather: CloudSun,
  itinerary: Map,
  validation: ShieldCheck,
  optimization: BrainCircuit,
};

export default function AgentWorkflowItem({
  event,
  last = false,
}: AgentWorkflowItemProps) {
  const ActivityIcon =
    activityIcons[
      event.type
    ];

  const statusConfig = {
    completed: {
      StatusIcon:
        CheckCircle2,

      circle:
        "border-[#d1bcff]/35 bg-[#161323] text-[#d1bcff]",

      card:
        "border-white/10 bg-white/[0.03]",

      title:
        "text-[#e6e0e8]",
    },

    running: {
      StatusIcon:
        LoaderCircle,

      circle:
        "border-[#fcd34d]/50 bg-[#211B10] text-[#fcd34d] shadow-[0_0_15px_rgba(252,211,77,0.28)]",

      card:
        "border-[#fcd34d]/35 bg-[#fcd34d]/[0.045]",

      title:
        "text-[#fcd34d]",
    },

    warning: {
      StatusIcon:
        TriangleAlert,

      circle:
        "border-[#fb7185]/40 bg-[#211117] text-[#fb7185]",

      card:
        "border-[#fb7185]/30 bg-[#fb7185]/[0.05]",

      title:
        "text-[#fb7185]",
    },

    failed: {
      StatusIcon:
        XCircle,

      circle:
        "border-red-400/40 bg-[#201116] text-red-400",

      card:
        "border-red-400/30 bg-red-400/[0.05]",

      title:
        "text-red-400",
    },

    queued: {
      StatusIcon:
        Hourglass,

      circle:
        "border-white/10 bg-[#0D1324] text-[#7f8798]",

      card:
        "border-white/[0.06] bg-white/[0.015] opacity-45",

      title:
        "text-[#948e9c]",
    },
  };

  const config =
    statusConfig[
      event.status
    ];

  const StatusIcon =
    config.StatusIcon;

  return (
    <div className="relative flex gap-3 sm:gap-4">
      {/* Timeline */}
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border ${config.circle}`}
        >
          <StatusIcon
            size={16}
            className={
              event.status ===
              "running"
                ? "animate-spin"
                : ""
            }
          />
        </div>

        {!last && (
          <div className="absolute bottom-0 left-1/2 top-9 w-px -translate-x-1/2 bg-white/10" />
        )}
      </div>

      {/* Event Card */}
      <div
        className={`relative mb-5 min-w-0 flex-1 overflow-hidden rounded-xl border p-4 ${config.card}`}
      >
        {/* Running top indicator */}
        {event.status ===
          "running" && (
          <div className="absolute left-0 top-0 h-0.5 w-2/3 bg-gradient-to-r from-[#fb7185] to-[#fcd34d]" />
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <ActivityIcon
              size={16}
              className={`mt-0.5 shrink-0 ${
                event.status ===
                "running"
                  ? "text-[#fcd34d]"
                  : event.status ===
                      "warning"
                    ? "text-[#fb7185]"
                    : "text-[#948e9c]"
              }`}
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-sm font-semibold ${config.title}`}
                >
                  {event.title}
                </h3>

                {event.provider && (
                  <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-medium text-[#948e9c]">
                    {
                      event.provider
                    }
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs leading-5 text-[#948e9c]">
                {
                  event.description
                }
              </p>

              {event.result && (
                <div className="mt-3 inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-[#d1bcff]">
                  {event.result}
                </div>
              )}
            </div>
          </div>

          {event.duration && (
            <span
              className={`shrink-0 text-[10px] font-medium ${
                event.status ===
                "running"
                  ? "text-[#fcd34d]"
                  : "text-[#7f8798]"
              }`}
            >
              {event.duration}
              {event.status ===
              "running"
                ? "..."
                : ""}
            </span>
          )}
        </div>

        {/* Running agent state */}
        {event.status ===
          "running" && (
          <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3 text-[10px] text-[#948e9c]">
            <RefreshCcw
              size={12}
              className="animate-spin text-[#fcd34d]"
            />

            VoyageAI is evaluating alternatives
          </div>
        )}
      </div>
    </div>
  );
}