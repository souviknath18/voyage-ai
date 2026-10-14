import {
  WalletCards,
} from "lucide-react";

import type {
  TripExportSettings,
} from "@/types/trip-export";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

import ExportBookingPreview from "./ExportBookingPreview";
import ExportItineraryPreview from "./ExportItineraryPreview";
import ExportPreviewHero from "./ExportPreviewHero";

interface ExportPreviewProps {
  trip:
    TripWorkspaceData;

  settings:
    TripExportSettings;
}


function formatCurrency(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}


export default function ExportPreview({
  trip,
  settings,
}: ExportPreviewProps) {
  return (
    <section className="min-w-0 min-h-0 flex-1 overflow-y-auto bg-[#080C17] px-3 py-6 sm:px-4 lg:px-5">
      <div
        data-trip-export-document
        className="mx-auto w-full max-w-[1000px] overflow-hidden rounded-xl border border-white/10 bg-[#141218] shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
      >
        <ExportPreviewHero
          trip={trip}
        />

        <div className="space-y-8 p-5 sm:p-7">
          {settings.itinerary && (
            <ExportItineraryPreview
              itinerary={trip.itinerary}
              currency={trip.currency}
            />
          )}

          {settings.budget && (
            <section>
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <WalletCards
                  size={18}
                  className="text-[#fb7185]"
                />

                <h2 className="text-base font-semibold text-[#e6e0e8]">
                  Cost Breakdown
                </h2>
              </div>

              {/* Budget Summary */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#7f8798]">
                    Total Budget
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-[#e6e0e8]">
                    {formatCurrency(
                      trip.totalBudget,
                      trip.currency,
                    )}
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#7f8798]">
                    Estimated Trip Cost
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-[#e6e0e8]">
                    {formatCurrency(
                      trip.estimatedCost,
                      trip.currency,
                    )}
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#7f8798]">
                    Remaining Budget
                  </p>

                  <p
                    className={`mt-1.5 text-sm font-semibold ${
                      trip.remainingBudget < 0
                        ? "text-[#fb7185]"
                        : "text-[#e6e0e8]"
                    }`}
                  >
                    {formatCurrency(
                      trip.remainingBudget,
                      trip.currency,
                    )}
                  </p>
                </div>
              </div>

              {/* Category Breakdown */}
              <h3 className="mt-6 text-xs font-semibold text-[#cbc4d2]">
                Estimated Expenses by Category
              </h3>

              {trip.budgetBreakdown.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {trip.budgetBreakdown.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-white/10 bg-white/[0.025] p-3"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-[#7f8798]">
                        {item.label}
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-[#e6e0e8]">
                        {formatCurrency(
                          item.amount,
                          trip.currency,
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-4">
                  <p className="text-xs text-[#948e9c]">
                    No category-level budget estimates
                    are available for this trip.
                  </p>
                </div>
              )}

              <p className="mt-4 text-[11px] leading-relaxed text-[#948e9c]">
                All amounts are estimates and may change
                before booking. Selected flights and hotels
                are not confirmed purchases.
              </p>
            </section>
          )}

          {settings.bookings && (
            <ExportBookingPreview
              trip={trip}
              masked={
                settings.maskSensitiveData
              }
            />
          )}

          {settings.maps && (
            <section>
              <h2 className="text-base font-semibold text-[#e6e0e8]">
                Map Preview
              </h2>

              <div className="mt-3 flex h-44 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02]">
                <p className="text-xs text-[#7f8798]">
                  Trip route map preview
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Document Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-[10px] text-[#7f8798] sm:px-7">
          <span>
            Generated securely by VoyageAI
          </span>

          <span>
            Preview
          </span>
        </div>
      </div>
    </section>
  );
}