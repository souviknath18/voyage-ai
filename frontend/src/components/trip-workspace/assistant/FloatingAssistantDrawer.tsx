"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CloudSun,
  MapPin,
  Send,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  DestinationImage,
} from "@/components/ui";

interface FloatingAssistantDrawerProps {
  open: boolean;
  tripId: string;
  destination: string;
  image?: string;
  onCloseAction: () => void;
}

const suggestions = [
  {
    label: "Best food nearby?",
    icon: Utensils,
  },
  {
    label: "Improve itinerary",
    icon: CalendarDays,
  },
  {
    label: "Check weather",
    icon: CloudSun,
  },
];

export default function FloatingAssistantDrawer({
  open,
  tripId,
  destination,
  image,
  onCloseAction,
}: FloatingAssistantDrawerProps) {
  const router = useRouter();

  const [
    message,
    setMessage,
  ] = useState("");

  if (!open) {
    return null;
  }

  const submit = (
    prompt?: string,
  ) => {
    const value =
      prompt ??
      message.trim();

    if (!value) {
      return;
    }

    console.log(
      "VoyageAI:",
      value,
    );

    setMessage("");
  };

  const openFullAssistant =
    () => {
      onCloseAction();

      router.push(
        `/trips/${tripId}/assistant`,
      );
    };

  return (
    <div className="fixed inset-0 z-[70]">
      {/* ================================= */}
      {/* OVERLAY */}
      {/* ================================= */}

      <button
        type="button"
        aria-label="Close assistant"
        onClick={onCloseAction}
        className="absolute inset-0 h-full w-full bg-black/60"
      />

      {/* ================================= */}
      {/* QUICK CHAT */}
      {/* ================================= */}

      <aside className="absolute bottom-4 right-4 z-10 flex max-h-[540px] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1324] shadow-[0_24px_70px_rgba(0,0,0,0.65)] sm:bottom-6 sm:right-6 sm:h-[540px] sm:w-[360px]">
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* VoyageAI Icon */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]">
              <Sparkles
                size={15}
              />
            </div>

            {/* Title */}

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[#e6e0e8]">
                VoyageAI
              </h2>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />

                <p className="truncate text-[11px] text-[#948e9c]">
                  {destination} trip context active
                </p>
              </div>
            </div>
          </div>

          {/* Close */}

          <button
            type="button"
            aria-label="Close quick chat"
            onClick={onCloseAction}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-[#e6e0e8] transition hover:border-white/20 hover:bg-white/[0.10] active:scale-95 sm:h-8 sm:w-8"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </header>

        {/* ================================= */}
        {/* CONTENT */}
        {/* ================================= */}

        <main className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="flex min-h-full flex-col">
            {/* ================================= */}
            {/* TRIP CONTEXT */}
            {/* ================================= */}

            <div className="group relative h-[115px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#070B18]">
              {/* Destination Background Image */}
              <div className="absolute inset-0">
                <DestinationImage
                  src={image}
                  alt={`${destination} trip`}
                  className="h-full w-full"
                  imageClassName="object-center"
                />
              </div>

              {/* Dark Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-black/25" />

              {/* Gradient Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B18] via-[#070B18]/55 to-[#070B18]/10" />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-end p-3.5">
                <div className="flex items-center gap-1.5">
                  <MapPin
                    size={12}
                    className="text-[#fb7185]"
                  />

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#fb7185]">
                    Active Workspace
                  </span>
                </div>

                <h3 className="mt-1 text-base font-semibold text-[#e6e0e8]">
                  {destination} Discovery
                </h3>

                <p className="mt-0.5 text-[11px] text-[#cbc4d2]">
                  Trip planning active
                </p>
              </div>
            </div>

            {/* ================================= */}
            {/* SUGGESTIONS */}
            {/* ================================= */}

            <section className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
                Try asking VoyageAI
              </p>

              <div className="mt-2.5 flex flex-wrap gap-2">
                {suggestions.map(
                  (
                    suggestion,
                  ) => {
                    const Icon =
                      suggestion.icon;

                    return (
                      <button
                        key={
                          suggestion.label
                        }
                        type="button"
                        onClick={() =>
                          submit(
                            suggestion.label,
                          )
                        }
                        className="group flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-[11px] font-medium text-[#cbc4d2] transition hover:border-[#fb7185]/30 hover:bg-white/[0.06] hover:text-[#e6e0e8]"
                      >
                        <Icon
                          size={13}
                          className="text-[#948e9c] transition group-hover:text-[#fb7185]"
                        />

                        {
                          suggestion.label
                        }
                      </button>
                    );
                  },
                )}
              </div>
            </section>

            {/* ================================= */}
            {/* FULL ASSISTANT */}
            {/* ================================= */}

            <div className="mt-auto pt-4">
              <button
                type="button"
                onClick={
                  openFullAssistant
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-xs font-semibold text-[#e6e0e8] transition hover:border-white/15 hover:bg-white/[0.06]"
              >
                Open Full Assistant

                <ArrowUpRight
                  size={14}
                  className="text-[#fb7185]"
                />
              </button>
            </div>
          </div>
        </main>

        {/* ================================= */}
        {/* COMPOSER */}
        {/* ================================= */}

        <footer className="shrink-0 border-t border-white/10 bg-[#0D1324] p-3">
          <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#070B18] p-1.5 transition focus-within:border-[#fb7185]/30">
            <textarea
              value={message}
              onChange={(
                event,
              ) =>
                setMessage(
                  event.target
                    .value,
                )
              }
              onKeyDown={(
                event,
              ) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  submit();
                }
              }}
              rows={1}
              placeholder="Ask about this trip..."
              className="max-h-[90px] min-h-[40px] min-w-0 flex-1 resize-none border-0 bg-transparent px-2.5 py-2.5 text-xs leading-5 text-[#e6e0e8] outline-none placeholder:text-[#7f8798] focus:ring-0"
            />

            {/* Send */}

            <button
              type="button"
              aria-label="Send"
              onClick={() =>
                submit()
              }
              disabled={
                !message.trim()
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#fb7185] to-[#fcd34d] text-[#070B18] transition hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-[#7f8798]">
            AI can make mistakes. Check important info.
          </p>
        </footer>
      </aside>
    </div>
  );
}