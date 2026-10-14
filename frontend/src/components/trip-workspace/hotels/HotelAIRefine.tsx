
"use client";

import {
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";

import { useState } from "react";

interface HotelAIRefineProps {
  refining?: boolean;
  onSubmitAction: (prompt: string) => void;
}

export default function HotelAIRefine({
  refining = false,
  onSubmitAction,
}: HotelAIRefineProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const prompt = value.trim();

    if (!prompt || refining) {
      return;
    }

    onSubmitAction(prompt);
    setValue("");
  };

  return (
    <div className="relative overflow-hidden rounded-full border border-[#fb7185]/20 bg-white/[0.04] p-1.5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fb7185]/[0.06] via-transparent to-[#fcd34d]/[0.06]" />

      <div className="relative z-10 flex items-center gap-2">
        <Sparkles
          size={16}
          className="ml-2 shrink-0 text-[#fb7185]"
        />

        <input
          value={value}
          disabled={refining}
          onChange={(event) =>
            setValue(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
          placeholder={
            refining
              ? "VoyageAI is refining your hotels..."
              : "Ask VoyageAI to refine these hotels..."
          }
          aria-label="AI hotel refinement instructions"
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-[#e6e0e8] outline-none placeholder:text-[#7f8798] disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={submit}
          disabled={!value.trim() || refining}
          aria-label={
            refining
              ? "Refining hotels"
              : "Refine hotels"
          }
          aria-busy={refining}
          className="voyage-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#24005b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {refining ? (
            <Loader2
              size={14}
              className="animate-spin"
            />
          ) : (
            <Send size={13} />
          )}
        </button>
      </div>
    </div>
  );
}