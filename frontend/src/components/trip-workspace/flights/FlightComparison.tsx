"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  FlightComparisonOption,
  TripWorkspaceData,
} from "@/types/trip-workspace";

import FlightAIRefine from "./FlightAIRefine";
import FlightBudgetImpact from "./FlightBudgetImpact";
import FlightComparisonCard from "./FlightComparisonCard";
import FlightComparisonHeader from "./FlightComparisonHeader";
import FlightFilters from "./FlightFilters";

interface FlightComparisonProps {
  trip: TripWorkspaceData;

  onBackAction: () => void;
}

export default function FlightComparison({
  trip,
  onBackAction,
}: FlightComparisonProps) {
  const [
    nonStop,
    setNonStop,
  ] = useState(false);

  const [
    oneStop,
    setOneStop,
  ] = useState(false);

  const [
    selectedAirlines,
    setSelectedAirlines,
  ] = useState<string[]>([]);

  const [
    selectedFlight,
    setSelectedFlight,
  ] = useState<
    FlightComparisonOption | undefined
  >();

  /*
   * Current selected flight.
   */
  const currentFlight =
    trip.flightOptions.find(
      (flight) =>
        flight.current,
    ) ??
    trip.flightOptions[0];

  /*
   * Build airline filter options
   * automatically from flight data.
   */
  const airlines =
    useMemo(() => {
      return Array.from(
        new Set(
          trip.flightOptions.map(
            (flight) =>
              flight.airline,
          ),
        ),
      );
    }, [
      trip.flightOptions,
    ]);

  /*
   * Apply filters.
   */
  const visibleFlights =
    useMemo(() => {
      let result =
        trip.flightOptions;

      /*
       * Stops filter.
       *
       * If neither checkbox is selected,
       * show all flights.
       */
      if (
        nonStop ||
        oneStop
      ) {
        result =
          result.filter(
            (flight) =>
              (nonStop &&
                flight.stops ===
                  0) ||
              (oneStop &&
                flight.stops ===
                  1),
          );
      }

      /*
       * Airline filter.
       *
       * If no airline is selected,
       * show all airlines.
       */
      if (
        selectedAirlines.length >
        0
      ) {
        result =
          result.filter(
            (flight) =>
              selectedAirlines.includes(
                flight.airline,
              ),
          );
      }

      return result;
    }, [
      trip.flightOptions,
      nonStop,
      oneStop,
      selectedAirlines,
    ]);

  /*
   * VoyageAI flight refinement.
   */
  const handleAIRefine = (
    prompt: string,
  ) => {
    console.log(
      "Flight refinement:",
      prompt,
    );

    /*
     * Later:
     *
     * Send prompt to VoyageAI
     * flight search / optimization API.
     */
  };

  /*
   * Airline checkbox.
   */
  const handleAirlineChange = (
    airline: string,
    checked: boolean,
  ) => {
    setSelectedAirlines(
      (previous) => {
        if (checked) {
          /*
           * Prevent duplicate airlines.
           */
          if (
            previous.includes(
              airline,
            )
          ) {
            return previous;
          }

          return [
            ...previous,
            airline,
          ];
        }

        return previous.filter(
          (item) =>
            item !==
            airline,
        );
      },
    );
  };

  /*
   * Reset all filters.
   */
  const handleResetFilters =
    () => {
      setNonStop(false);

      setOneStop(false);

      setSelectedAirlines(
        [],
      );
    };

  /*
   * User selects another flight.
   */
  const handleSelectFlight = (
    flight:
      FlightComparisonOption,
  ) => {
    /*
     * Current flight is already
     * selected, so don't show
     * budget impact for it.
     */
    if (flight.current) {
      return;
    }

    setSelectedFlight(
      flight,
    );
  };

  /*
   * Confirm new flight.
   */
  const handleConfirm =
    () => {
      if (
        !selectedFlight
      ) {
        return;
      }

      console.log(
        "Selected flight:",
        selectedFlight,
      );

      /*
       * Later:
       *
       * PATCH /api/trips/:tripId/flight
       *
       * Backend should:
       *
       * 1. Change selected flight
       * 2. Recalculate trip cost
       * 3. Recalculate remaining budget
       * 4. Recalculate airport transfer
       * 5. Check hotel check-in timing
       * 6. Check itinerary conflicts
       */

      setSelectedFlight(
        undefined,
      );
    };

  return (
    <div className="space-y-5">
      {/* ========================== */}
      {/* Header */}
      {/* ========================== */}

      <FlightComparisonHeader
        origin={
          trip.origin
        }
        destination={
          trip.destination
        }
        originCode={
          trip.originCode
        }
        destinationCode={
          trip.destinationCode
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
        currency={
          trip.currency
        }
        flightBudget={
          currentFlight?.price ??
          trip.flights[0]?.price ??
          0
        }
        onBackAction={
          onBackAction
        }
      />

      {/* ========================== */}
      {/* Main Layout */}
      {/* ========================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* ====================== */}
        {/* Filters */}
        {/* ====================== */}

        <aside className="xl:col-span-3">
          <div className="xl:sticky xl:top-20">
            <FlightFilters
              nonStop={
                nonStop
              }
              oneStop={
                oneStop
              }
              airlines={
                airlines
              }
              selectedAirlines={
                selectedAirlines
              }
              onNonStopChangeAction={
                setNonStop
              }
              onOneStopChangeAction={
                setOneStop
              }
              onAirlineChangeAction={
                handleAirlineChange
              }
              onResetAction={
                handleResetFilters
              }
            />
          </div>
        </aside>

        {/* ====================== */}
        {/* Flight Results */}
        {/* ====================== */}

        <div className="space-y-4 xl:col-span-9">
          {/* AI Refinement */}
          <FlightAIRefine
            onSubmitAction={
              handleAIRefine
            }
          />

          {/* Results */}
          {visibleFlights.length >
          0 ? (
            visibleFlights.map(
              (flight) => (
                <FlightComparisonCard
                  key={
                    flight.id
                  }
                  flight={
                    flight
                  }
                  currency={
                    trip.currency
                  }
                  onSelectAction={
                    handleSelectFlight
                  }
                />
              ),
            )
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-14 text-center">
              <h2 className="text-sm font-semibold text-[#e6e0e8]">
                No matching flights
              </h2>

              <p className="mt-2 text-xs text-[#948e9c]">
                Try changing your filters
                or ask VoyageAI to search
                differently.
              </p>

              <button
                type="button"
                onClick={
                  handleResetFilters
                }
                className="mt-4 text-xs font-semibold text-[#d1bcff] transition hover:text-[#fb7185]"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================== */}
      {/* Budget Impact Modal */}
      {/* ========================== */}

      {selectedFlight &&
        currentFlight && (
          <FlightBudgetImpact
            open
            currentFlight={
              currentFlight
            }
            selectedFlight={
              selectedFlight
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
              setSelectedFlight(
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