"use client";

import {
  selectTripHotel,
  deleteSelectedTripHotel,
} from "@/lib/trips";

import {
  useState,
} from "react";

import { Sparkles } from "lucide-react";

import type {
  HotelComparisonOption,
  TripWorkspaceData,
} from "@/types/trip-workspace";

import type {
  RecommendedHotelResponse,
} from "@/lib/trips";

import CurrentHotelSummary from "./CurrentHotelSummary";
import HotelAIInsight from "./HotelAIInsight";
import HotelBudgetImpact from "./HotelBudgetImpact";
import HotelComparisonCard from "./HotelComparisonCard";
import HotelComparisonHeader from "./HotelComparisonHeader";
import HotelAIRefine from "./HotelAIRefine";
import HotelRefinementSkeleton from "./HotelRefinementSkeleton";

interface HotelComparisonProps {
  trip: TripWorkspaceData;
  recommendation: RecommendedHotelResponse | null;
  onBackAction: () => void;
  budgetReady: boolean;
  budgetLoading: boolean;
  onSelectionChangedAction: () => Promise<void>;
  refining?: boolean;
  onRefineAction: (prompt: string) => void;
  matchingOfferIds?: string[] | null;
  onResetRefinementAction?: () => void;
  refinementMessage?: string | null;
}

export default function HotelComparison({
  trip,
  recommendation,
  onBackAction,
  budgetReady,
  budgetLoading,
  onSelectionChangedAction,
  refining = false,
  onRefineAction,
  matchingOfferIds = null,
  onResetRefinementAction,
  refinementMessage = null,
}: HotelComparisonProps) {
  const [
    selectedHotel,
    setSelectedHotel,
  ] = useState<
    HotelComparisonOption | undefined
  >();

  const [removingHotel, setRemovingHotel] = useState(false);
  const [savingHotel, setSavingHotel] = useState(false);

  const savedHotel = trip.hotelOptions.find(
    (hotel) => hotel.current,
  );

  const currentHotel =
    savedHotel ?? trip.hotelOptions[0];

  
  const recommendedOffer =
    recommendation?.recommended_hotel;

  const recommendedOption = recommendedOffer
    ? trip.hotelOptions.find(
        (hotel) => hotel.id === recommendedOffer.id,
      )
    : undefined;

  const recommendedPrice = recommendedOffer
    ? Number(recommendedOffer.converted_price)
    : null;

  const formattedRecommendedPrice =
    recommendedOffer &&
    recommendedPrice !== null &&
    Number.isFinite(recommendedPrice)
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: recommendedOffer.converted_currency,
          maximumFractionDigits: 0,
        }).format(recommendedPrice)
      : null;

  const recommendationText = recommendedOffer
    ? `VoyageAI recommends ${recommendedOffer.name} in ${trip.destination}.${
        formattedRecommendedPrice
          ? ` Estimated total cost: ${formattedRecommendedPrice} for ${recommendedOffer.nights} nights.`
          : ""
      } ${
        recommendedOption
          ? "You can compare and select this hotel from the available offers."
          : "This recommendation may be from an earlier search. Check current availability and pricing before selecting."
      }`
    : `Compare available hotels in ${trip.destination} based on price, location, amenities, and your trip budget.`;


  const matchingOfferIdSet =
    matchingOfferIds === null
      ? null
      : new Set(matchingOfferIds);

  const alternatives = trip.hotelOptions.filter(
    (hotel) =>
      hotel.id !== savedHotel?.id &&
      (
        matchingOfferIdSet === null ||
        matchingOfferIdSet.has(hotel.id)
      ),
  );

  const refinementActive = matchingOfferIdSet !== null;

  const handleSelectHotel = (
    hotel:
      HotelComparisonOption,
  ) => {
    setSelectedHotel(
      hotel,
    );
  };

  const handleConfirm = async () => {
    if (!selectedHotel || savingHotel || !budgetReady) {
      return;
    }

    try {
      setSavingHotel(true);

      await selectTripHotel(trip.id, selectedHotel.id);

      await onSelectionChangedAction();

      setSelectedHotel(undefined);
    } catch (error) {
      console.error("Failed to save or refresh hotel:", error);

      alert(
        "Unable to complete the hotel update. " +
        "The selection may have been saved; please check before retrying.",
      );
    } finally {
      setSavingHotel(false);
    }
  };

  const handleRemoveHotel = async () => {
    if (!savedHotel || removingHotel) {
      return;
    }

    const confirmed = window.confirm(
      `Remove ${savedHotel.name} from your trip?`,
    );

    if (!confirmed) return;

    try {
      setRemovingHotel(true);

      await deleteSelectedTripHotel(trip.id);

      await onSelectionChangedAction();
    } catch (error) {
      console.error("Failed to remove or refresh hotel:", error);

      alert(
        "Unable to complete the hotel update. " +
        "The hotel may already have been removed.",
      );
    } finally {
      setRemovingHotel(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <HotelComparisonHeader
        destination={
          trip.destination
        }
        startDate={
          trip.startDate
        }
        endDate={
          trip.endDate
        }
        travelers={
          trip.travelers
        }
        nights={
          currentHotel.nights
        }
        currency={
          trip.currency
        }
        hotelBudget={trip.hotelBudget ?? 0}
        onBackAction={
          onBackAction
        }
      />

      {/* Main */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Context */}
        <aside className="space-y-4 xl:col-span-3">
          <div className="xl:sticky xl:top-20">
            <div className="space-y-4">
              {savedHotel ? (
                <CurrentHotelSummary
                  hotel={savedHotel}
                  currency={trip.currency}
                  onRemoveAction={handleRemoveHotel}
                  removing={removingHotel}
                />
              ) : (
                <div className="rounded-xl border border-[#302b3b] bg-[#121421] p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#fb7185]">
                    Current Accommodation
                  </p>

                  <p className="mt-4 text-sm font-medium text-[#e6e0e8]">
                    No hotel selected yet
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-[#948e9c]">
                    Compare the recommended hotels and select
                    one to add to your trip.
                  </p>
                </div>
              )}

              <HotelAIInsight text={recommendationText} />
            </div>
          </div>
        </aside>

        {/* Alternatives */}
        <div className="xl:col-span-9">
          <div className="mb-5 space-y-3">
            <HotelAIRefine
              refining={refining}
              onSubmitAction={onRefineAction}
            />

            
            {refinementMessage && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-[#C4B5FD]/25 bg-[#C4B5FD]/[0.06] px-4 py-3 text-sm text-[#e6e0e8]"
              >
                <div className="flex items-start gap-2">
                  <Sparkles
                    size={16}
                    className="mt-0.5 shrink-0 text-[#C4B5FD]"
                  />

                  <p className="leading-relaxed">
                    {refinementMessage}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#e6e0e8] sm:text-xl">
                Curated Alternatives
              </h2>

              <p className="mt-1 text-sm text-[#948e9c]">
                {refining
                  ? "VoyageAI is finding hotels that match your preferences..."
                  : refinementActive
                    ? `${alternatives.length} matching hotel${alternatives.length === 1 ? "" : "s"} available.`
                    : "Hotels selected for your budget, itinerary and travel preferences."}
              </p>
            </div>

            {refinementActive && onResetRefinementAction && (
              <button
                type="button"
                onClick={onResetRefinementAction}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-[#e6e0e8] transition hover:bg-white/[0.08]"
              >
                Reset filters
              </button>
            )}
          </div>

          
          {refining ? (
            <HotelRefinementSkeleton count={2} />
          ) : alternatives.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {alternatives.map((hotel) => (
                <HotelComparisonCard
                  key={hotel.id}
                  hotel={hotel}
                  currentHotel={currentHotel}
                  currency={trip.currency}
                  hotelBudget={trip.hotelBudget}
                  hasSelectedHotel={Boolean(savedHotel)}
                  onSelectAction={handleSelectHotel}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-white/10 bg-[#121421] px-6 py-12 text-center">
              <p className="text-base font-semibold text-[#e6e0e8]">
                {refinementActive
                  ? "No hotels match your preferences"
                  : "No alternative hotels available"}
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#948e9c]">
                {refinementActive
                  ? "Try a higher budget, a lower rating requirement, or fewer amenities."
                  : "There are currently no additional hotels to compare."}
              </p>

              {refinementActive && onResetRefinementAction && (
                <button
                  type="button"
                  onClick={onResetRefinementAction}
                  className="mt-5 rounded-full border border-[#fb7185]/30 bg-[#fb7185]/10 px-5 py-2 text-sm font-medium text-[#fb7185] transition hover:bg-[#fb7185]/20"
                >
                  Show all hotels
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Budget Impact */}
      {selectedHotel && (
        <HotelBudgetImpact
          open
          currentHotel={currentHotel}
          selectedHotel={selectedHotel}
          currency={trip.currency}
          totalBudget={trip.totalBudget}
          estimatedCost={trip.estimatedCost}
          hasSelectedHotel={Boolean(savedHotel)}
          budgetReady={budgetReady}
          budgetLoading={budgetLoading}
          savingHotel={savingHotel}
          onCloseAction={() => setSelectedHotel(undefined)}
          onConfirmAction={handleConfirm}
        />
      )}
    </div>
  );
}