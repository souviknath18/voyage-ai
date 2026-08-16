"use client";

import {
  Bot,
  Sparkles,
} from "lucide-react";

interface FloatingAssistantProps {
  open: boolean;

  onClickAction: () => void;
}

export default function FloatingAssistant({
  open,
  onClickAction,
}: FloatingAssistantProps) {
  if (open) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={
        onClickAction
      }
      className="fixed bottom-5 right-4 z-[70] flex items-center gap-2 rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d] px-4 py-3 text-[#070B18] shadow-[0_12px_30px_rgba(251,113,133,0.25)] transition hover:-translate-y-0.5 sm:right-6"
    >
      <Bot size={17} />

      <span className="hidden text-xs font-semibold sm:inline">
        Ask VoyageAI
      </span>

      <Sparkles
        size={12}
      />
    </button>
  );
}