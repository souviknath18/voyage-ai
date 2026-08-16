import {
  CheckCircle2,
  Hourglass,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import type {
  AssistantStep,
} from "@/types/trip-assistant";

interface AssistantThinkingProps {
  steps: AssistantStep[];
}

export default function AssistantThinking({
  steps,
}: AssistantThinkingProps) {
  const completed =
    steps.filter(
      (step) =>
        step.status ===
        "completed",
    ).length;

  const progress =
    steps.length > 0
      ? Math.round(
          (completed /
            steps.length) *
            100,
        )
      : 0;

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#fb7185]/25 bg-[#fb7185]/10 text-[#fb7185]">
        <Sparkles size={14} />
      </div>

      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#fb7185]">
            VoyageAI is working
          </p>

          <div className="space-y-3">
            {steps.map(
              (step) => {
                const Icon =
                  step.status ===
                  "completed"
                    ? CheckCircle2
                    : step.status ===
                        "running"
                      ? LoaderCircle
                      : Hourglass;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-2.5 text-xs ${
                      step.status ===
                      "completed"
                        ? "text-[#948e9c]"
                        : step.status ===
                            "running"
                          ? "text-[#e6e0e8]"
                          : "text-[#7f8798]"
                    }`}
                  >
                    <Icon
                      size={14}
                      className={
                        step.status ===
                        "running"
                          ? "animate-spin text-[#fcd34d]"
                          : step.status ===
                              "completed"
                            ? "text-emerald-400"
                            : ""
                      }
                    />

                    {step.title}
                  </div>
                );
              },
            )}
          </div>
        </div>

        <div className="h-0.5 bg-white/[0.05]">
          <div
            className="h-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d] transition-[width] duration-700"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}