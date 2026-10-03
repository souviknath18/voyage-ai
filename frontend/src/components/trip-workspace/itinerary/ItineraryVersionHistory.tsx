"use client";

import {
  Check,
  Clock3,
  History,
  Loader2,
  RotateCcw,
} from "lucide-react";

import type {
  ItineraryVersion,
} from "@/lib/trips";


interface ItineraryVersionHistoryProps {
  versions: ItineraryVersion[];
  currentVersion: number;
  viewingVersion: number;

  restoringVersion: number | null;

  onViewAction: (
    version: number,
  ) => void;

  onRestoreAction: (
    version: number,
  ) => void;
}


function formatCurrency(
  value: string,
  currency: string,
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    },
  ).format(
    Number(value),
  );
}


function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
}


export default function ItineraryVersionHistory({
  versions,
  currentVersion,
  viewingVersion,
  restoringVersion,
  onViewAction,
  onRestoreAction,
}: ItineraryVersionHistoryProps) {
  if (versions.length === 0) {
    return null;
  }


  return (
    <div className="rounded-2xl border border-white/10 bg-[#15121a] p-4 shadow-xl">

      <div className="flex items-start gap-3 border-b border-white/10 pb-4">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fb7185]/10 text-[#fb7185]">
          <History size={17} />
        </div>


        <div>
          <h3 className="text-sm font-semibold text-[#eee8f0]">
            Itinerary History
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#8f8997]">
            View previous versions or restore
            one without losing your history.
          </p>
        </div>

      </div>


      <div className="mt-3 space-y-2">

        {versions.map(
          (item) => {
            const isCurrent =
              item.version ===
              currentVersion;

            const isViewing =
              item.version ===
              viewingVersion;

            const isRestoring =
              restoringVersion ===
              item.version;


            return (
              <div
                key={item.id}
                className={`rounded-xl border p-3 transition ${
                  isViewing
                    ? "border-[#fb7185]/30 bg-[#fb7185]/[0.07]"
                    : "border-white/[0.08] bg-white/[0.025]"
                }`}
              >

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="text-sm font-semibold text-[#e9e3eb]">
                        Version {item.version}
                      </span>


                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          <Check size={10} />
                          Current
                        </span>
                      )}


                      {item.version === 1 && (
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-[#aaa3b0]">
                          Original
                        </span>
                      )}

                    </div>


                    <p className="mt-1.5 text-sm font-medium text-[#d8d1dc]">
                      {formatCurrency(
                        item.estimated_total_cost,
                        item.currency,
                      )}
                    </p>


                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#817a88]">
                      <Clock3 size={11} />

                      {formatDate(
                        item.created_at,
                      )}
                    </div>

                  </div>


                  <div className="flex shrink-0 items-center gap-2">

                    {!isViewing && (
                      <button
                        type="button"
                        onClick={() =>
                          onViewAction(
                            item.version,
                          )
                        }
                        className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-[#bbb4c1] transition hover:bg-white/[0.06] hover:text-white"
                      >
                        View
                      </button>
                    )}


                    {!isCurrent && (
                      <button
                        type="button"
                        disabled={
                          restoringVersion !==
                          null
                        }
                        onClick={() =>
                          onRestoreAction(
                            item.version,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#fb7185]/10 px-2.5 py-1.5 text-[11px] font-medium text-[#fb7185] transition hover:bg-[#fb7185]/15 disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        {isRestoring ? (
                          <Loader2
                            size={11}
                            className="animate-spin"
                          />
                        ) : (
                          <RotateCcw
                            size={11}
                          />
                        )}

                        {isRestoring
                          ? "Restoring"
                          : "Restore"}

                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          },
        )}

      </div>

    </div>
  );
}