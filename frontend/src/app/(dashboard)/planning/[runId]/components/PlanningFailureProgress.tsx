"use client";

interface PlanningProgressStep {
  id: string;

  label: string;

  description: string;

  status:
    | "completed"
    | "failed"
    | "pending";
}

interface PlanningFailureProgressProps {
  steps?: PlanningProgressStep[];
}

const defaultSteps: PlanningProgressStep[] = [
  {
    id: "preferences",

    label:
      "Understanding preferences",

    description:
      "Travel preferences and trip constraints analyzed.",

    status:
      "completed",
  },

  {
    id: "strategy",

    label:
      "Building travel strategy",

    description:
      "Initial trip structure and planning approach created.",

    status:
      "completed",
  },

  {
    id: "experiences",

    label:
      "Finding experiences",

    description:
      "VoyageAI couldn't finish curating suitable places and activities.",

    status:
      "failed",
  },

  {
    id: "itinerary",

    label:
      "Creating itinerary",

    description:
      "Waiting for the previous planning stage.",

    status:
      "pending",
  },

  {
    id: "finalizing",

    label:
      "Finalizing trip",

    description:
      "Waiting for itinerary generation.",

    status:
      "pending",
  },
];

export default function PlanningFailureProgress({
  steps = defaultSteps,
}: PlanningFailureProgressProps) {
  return (
    <div className="h-full rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f8798]">
        Planning Progress
      </p>

      <div className="mt-4">
        {steps.map(
          (
            step,
            index,
          ) => (
            <ProgressItem
              key={
                step.id
              }
              label={
                step.label
              }
              description={
                step.description
              }
              status={
                step.status
              }
              last={
                index ===
                steps.length -
                  1
              }
            />
          ),
        )}
      </div>
    </div>
  );
}

function ProgressItem({
  label,
  description,
  status,
  last,
}: {
  label: string;

  description: string;

  status:
    | "completed"
    | "failed"
    | "pending";

  last: boolean;
}) {
  return (
    <div className="relative flex gap-3">
      {/* Timeline */}
      <div className="relative flex shrink-0 flex-col items-center">
        <div
          className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border ${
            status ===
            "completed"
              ? "border-[#d1bcff]/40 bg-[#d1bcff]/10 text-[#d1bcff]"
              : status ===
                  "failed"
                ? "border-[#fb7185]/50 bg-[#fb7185]/10 text-[#fb7185] shadow-[0_0_12px_rgba(251,113,133,0.18)]"
                : "border-white/10 bg-white/[0.03] text-[#596174]"
          }`}
        >
          {status ===
            "completed" && (
            <span className="text-[11px] font-bold">
              ✓
            </span>
          )}

          {status ===
            "failed" && (
            <span className="h-2 w-2 rounded-full bg-[#fb7185]" />
          )}
        </div>

        {!last && (
          <div className="absolute bottom-0 top-6 w-px bg-white/10" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 pb-4">
        <p
          className={`text-xs font-medium sm:text-[13px] ${
            status ===
            "failed"
              ? "text-[#fb7185]"
              : status ===
                  "pending"
                ? "text-[#7f8798]"
                : "text-[#e6e0e8]"
          }`}
        >
          {label}
        </p>

        <p className="mt-0.5 text-[11px] leading-4 text-[#7f8798]">
          {description}
        </p>
      </div>
    </div>
  );
}