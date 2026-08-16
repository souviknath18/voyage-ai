"use client";

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
  trip:
    TripWorkspaceData;

  onBackAction: () => void;
}

export default function HotelComparison({
  trip,
  onBackAction,
}: HotelComparisonProps) {
  const [
    selectedHotel,
    setSelectedHotel,
  ] = useState<
    HotelComparisonOption | undefined
  >();

  const currentHotel =
    trip.hotelOptions.find(
      (hotel) =>
        hotel.current,
    ) ??
    trip.hotelOptions[0];

  const alternatives =
    trip.hotelOptions.filter(
      (hotel) =>
        !hotel.current,
    );

  const handleSelectHotel = (
    hotel:
      HotelComparisonOption,
  ) => {
    setSelectedHotel(
      hotel,
    );
  };

  const handleConfirm =
    () => {
      if (
        !selectedHotel
      ) {
        return;
      }

      console.log(
        "Selected hotel:",
        selectedHotel,
      );

      /*
       * Later:
       *
       * PATCH /api/trips/:tripId/hotel
       *
       * Backend should:
       *
       * 1. Update selected hotel
       * 2. Update accommodation cost
       * 3. Recalculate total trip cost
       * 4. Recalculate remaining budget
       * 5. Check distance to itinerary
       * 6. Potentially re-optimize transport
       */

      setSelectedHotel(
        undefined,
      );
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
        hotelBudget={
          currentHotel.pricePerNight *
          currentHotel.nights
        }
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
              <CurrentHotelSummary
                hotel={
                  currentHotel
                }
                currency={
                  trip.currency
                }
              />

              <HotelAIInsight
                text="VoyageAI recommends comparing hotels based on location as well as price. Staying near Shinjuku or Shibuya can reduce daily transit time, while moving farther east may lower accommodation cost."
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
                  key={
                    hotel.id
                  }
                  hotel={
                    hotel
                  }
                  currentHotel={
                    currentHotel
                  }
                  currency={
                    trip.currency
                  }
                  onSelectAction={
                    handleSelectHotel
                  }
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
          currentHotel={
            currentHotel
          }
          selectedHotel={
            selectedHotel
          }
          currency={
            trip.currency
          }
          totalBudget={
            trip.totalBudget
          }
          estimatedCost={
            trip.estimatedCost
          }
          onCloseAction={() =>
            setSelectedHotel(
              undefined,
            )
          }
          onConfirmAction={
            handleConfirm
          }
        />
      )}
    </div>
  );
}