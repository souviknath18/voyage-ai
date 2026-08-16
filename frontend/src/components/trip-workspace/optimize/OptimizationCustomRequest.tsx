"use client";

import {
  Send,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";

interface OptimizationCustomRequestProps {
  onSubmitAction: (
    request: string,
  ) => void;
}

export default function OptimizationCustomRequest({
  onSubmitAction,
}: OptimizationCustomRequestProps) {
  const [
    request,
    setRequest,
  ] = useState("");

  const submit = () => {
    const value =
      request.trim();

    if (!value) {
      return;
    }

    onSubmitAction(value);
  };

  return (
    <section>
      <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
        Custom Request
      </h2>

      <p className="mt-1 text-xs text-[#948e9c]">
        Tell VoyageAI exactly what you want changed.
      </p>

      <div className="group relative mt-4">
        {/* Glow */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r from-[#fb7185]/40 via-[#fcd34d]/30 to-[#fb7185]/40 opacity-40 blur-sm transition group-focus-within:opacity-70" />

        <div className="relative flex items-center gap-2 rounded-xl border border-white/10 bg-[#0D1324]/95 p-2 backdrop-blur-xl">
          <Sparkles
            size={17}
            className="ml-2 shrink-0 text-[#fb7185]"
          />

          <input
            value={request}
            onChange={(
              event,
            ) =>
              setRequest(
                event.target
                  .value,
              )
            }
            onKeyDown={(
              event,
            ) => {
              if (
                event.key ===
                "Enter"
              ) {
                submit();
              }
            }}
            placeholder="e.g. Make it 15% cheaper without changing my hotel..."
            className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-[#e6e0e8] outline-none placeholder:text-[#7f8798]"
          />

          <button
            type="button"
            disabled={
              !request.trim()
            }
            onClick={submit}
            className="voyage-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#24005b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}