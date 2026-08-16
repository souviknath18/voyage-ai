"use client";

import {
  ArrowLeft,
  Bot,
  Sparkles,
} from "lucide-react";

interface TripAssistantHeaderProps {
  destination: string;

  onBackAction: () => void;
}

export default function TripAssistantHeader({
  destination,
  onBackAction,
}: TripAssistantHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackAction}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#948e9c] transition hover:bg-white/[0.05] hover:text-[#e6e0e8]"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#fb7185]/25 bg-[#fb7185]/10 text-[#fb7185]">
          <Bot size={17} />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-semibold text-[#e6e0e8]">
              VoyageAI Assistant
            </h1>

            <Sparkles
              size={11}
              className="text-[#fcd34d]"
            />
          </div>

          <p className="mt-0.5 text-[10px] text-[#7f8798]">
            {destination} • Trip-aware assistant
          </p>
        </div>
      </div>

      <span className="hidden items-center gap-1.5 text-[10px] text-emerald-400 sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

        Trip context active
      </span>
    </header>
  );
}