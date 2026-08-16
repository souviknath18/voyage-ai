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
    /*
     * Full viewport layer.
     *
     * This guarantees that the overlay covers
     * the entire viewport, including the gap
     * below the floating drawer.
     */
    <div className="fixed inset-0 z-[70]">
      {/* Full Screen Dark Overlay */}
      <button
        type="button"
        aria-label="Close assistant"
        onClick={onCloseAction}
        className="absolute inset-0 h-full w-full bg-black/30"
      />

      {/* Floating Assistant */}
      <aside className="absolute bottom-4 right-4 z-10 flex max-h-[540px] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#211f24] shadow-[0_22px_60px_rgba(0,0,0,0.55)] sm:bottom-6 sm:right-6 sm:h-[540px] sm:w-[360px]">
        {/* Header */}
        <header className="relative flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-3">
          {/* Accent */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#fb7185] via-[#fcd34d] to-transparent opacity-70" />

          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.06]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fb7185]/20 to-[#fcd34d]/20" />

              <Sparkles
                size={15}
                className="relative z-10 text-[#fb7185]"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-[#e6e0e8]">
                VoyageAI
              </h2>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#fcd34d]" />

                <p className="text-[11px] text-[#aaa3b0]">
                  {destination} trip context active
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onCloseAction}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#948e9c] transition hover:bg-white/[0.07] hover:text-[#e6e0e8]"
          >
            <X size={15} />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="flex min-h-full flex-col">
            {/* Trip Context */}
            <div className="group relative min-h-[115px] overflow-hidden rounded-xl border border-white/10">
              {image && (
                <DestinationImage
                  src={image}
                  alt={destination}
                  className="absolute inset-0 h-full w-full"
                  imageClassName="object-cover"
                />
              )}

              {!image && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#2e1065] via-[#211f24] to-[#141218]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#141218] via-[#141218]/65 to-transparent" />

              <div className="relative z-10 flex min-h-[115px] flex-col justify-end p-3.5">
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

            {/* Suggestions */}
            <section className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#948e9c]">
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
                        className="group flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-[11px] font-medium text-[#cbc4d2] transition hover:border-[#fb7185]/30 hover:bg-white/[0.07] hover:text-[#e6e0e8]"
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

            {/* Open Full Assistant */}
            <div className="mt-auto pt-4">
              <button
                type="button"
                onClick={
                  openFullAssistant
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xs font-semibold text-[#e6e0e8] transition hover:bg-white/[0.07]"
              >
                Open Full Assistant

                <ArrowUpRight
                  size={14}
                  className="text-[#d1bcff]"
                />
              </button>
            </div>
          </div>
        </main>

        {/* Composer */}
        <footer className="shrink-0 border-t border-white/10 bg-[#2b292f] p-3">
          <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#1d1b20] p-1.5 transition focus-within:border-[#fb7185]/30">
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
              className="max-h-[90px] min-h-[40px] min-w-0 flex-1 resize-none border-0 bg-transparent px-2.5 py-2.5 text-xs leading-5 text-[#e6e0e8] outline-none placeholder:text-[#7f7985] focus:ring-0"
            />

            <button
              type="button"
              aria-label="Send"
              onClick={() =>
                submit()
              }
              disabled={
                !message.trim()
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#fb7185] to-[#fcd34d] text-[#141218] transition active:scale-95 disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-[#7f7985]">
            AI can make mistakes. Check important info.
          </p>
        </footer>
      </aside>
    </div>
  );
}