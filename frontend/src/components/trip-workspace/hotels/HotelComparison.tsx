"use client";

import {
  selectTripHotel,
  deleteSelectedTripHotel,
} from "@/lib/trips";

import {
  useState,
} from "react";

import type {
  HotelComparisonOption,
  TripWorkspaceData,
} from "@/types/trip-workspace";

import CurrentHotelSummary from "./CurrentHotelSummary";
import HotelAIInsight from "./HotelAIInsight";
import HotelBudgetImpact from "./HotelBudgetImpact";
import HotelComparisonCard from "./HotelComparisonCard";
import HotelComparisonHeader from "./HotelComparisonHeader";

interface HotelComparisonProps {
  trip: TripWorkspaceData;
  onBackAction: () => void;
  budgetReady: boolean;
  budgetLoading: boolean;
  onSelectionChanged: () => Promise<void>;
}

export default function HotelComparison({
  trip,
  onBackAction,
  budgetReady,
  budgetLoading,
  onSelectionChanged,
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

  const alternatives = trip.hotelOptions.filter(
    (hotel) => hotel.id !== savedHotel?.id,
  );

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

      await onSelectionChanged();

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

      await onSelectionChanged();
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

              <HotelAIInsight
                text={`VoyageAI recommends comparing hotels in ${trip.destination} based on location, price, room amenities, and overall trip budget. Consider choosing accommodation near the attractions you plan to visit to reduce daily travel time and transportation costs.`}
              />
            </div>
          </div>
        </aside>

        {/* Alternatives */}
        <div className="xl:col-span-9">
          <div>
            <h2 className="text-lg font-semibold text-[#e6e0e8] sm:text-xl">
              Curated Alternatives
            </h2>

            <p className="mt-1 text-sm text-[#948e9c]">
              Hotels selected for your budget, itinerary and travel preferences.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {alternatives.map(
              (hotel) => (
                <HotelComparisonCard
                  key={hotel.id}
                  hotel={hotel}
                  currentHotel={currentHotel}
                  currency={trip.currency}
                  hotelBudget={trip.hotelBudget}
                  hasSelectedHotel={Boolean(savedHotel)}
                  onSelectAction={handleSelectHotel}
                />
              ),
            )}
          </div>
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