"use client";

import {
  Send,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";

interface ItineraryAIPromptProps {
  onSubmitAction: (
    prompt: string,
  ) => void;
}

export default function ItineraryAIPrompt({
  onSubmitAction,
}: ItineraryAIPromptProps) {
  const [prompt, setPrompt] =
    useState("");

  const handleSubmit = () => {
    const value =
      prompt.trim();

    if (!value) {
      return;
    }

    onSubmitAction(value);

    setPrompt("");
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#fb7185]/20 bg-white/[0.04] p-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fb7185]/5 via-[#fcd34d]/5 to-[#d1bcff]/5" />

      <div className="relative z-10 flex items-center gap-2">
        <Sparkles
          size={17}
          className="ml-2 shrink-0 text-[#fcd34d]"
        />

        <input
          value={prompt}
          onChange={(event) =>
            setPrompt(
              event.target.value,
            )
          }
          onKeyDown={(
            event,
          ) => {
            if (
              event.key ===
              "Enter"
            ) {
              handleSubmit();
            }
          }}
          placeholder="Ask VoyageAI to modify this itinerary..."
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-[#e6e0e8] outline-none placeholder:text-[#7f8798]"
        />

        <button
          type="button"
          onClick={
            handleSubmit
          }
          disabled={
            !prompt.trim()
          }
          className="voyage-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#24005b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}