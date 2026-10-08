"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  FlightComparisonOption,
  TripWorkspaceData,
} from "@/types/trip-workspace";

import {
  selectTripFlight,
} from "@/lib/trips";

import FlightAIRefine from "./FlightAIRefine";
import FlightBudgetImpact from "./FlightBudgetImpact";
import FlightComparisonCard from "./FlightComparisonCard";
import FlightComparisonHeader from "./FlightComparisonHeader";
import FlightFilters from "./FlightFilters";

interface FlightComparisonProps {
  trip: TripWorkspaceData;
  tripId: string;

  onBackAction: () => void;
}

export default function FlightComparison({
  trip,
  tripId,
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

  const [
    flightOptions,
    setFlightOptions,
  ] = useState<
    FlightComparisonOption[]
  >(
    trip.flightOptions,
  );

  const [
    currentFlightId,
    setCurrentFlightId,
  ] = useState<string | undefined>(
    trip.flightOptions.find(
      (flight) => flight.current,
    )?.id,
  );

  const [
    selecting,
    setSelecting,
  ] = useState(false);

  /*
   * Current selected flight.
   */
  const currentFlight =
    flightOptions.find(
      (flight) =>
        flight.id ===
        currentFlightId,
    ) ??
    flightOptions.find(
      (flight) =>
        flight.current,
    );

  /*
   * Build airline filter options
   * automatically from flight data.
   */
  const airlines =
    useMemo(() => {
      return Array.from(
        new Set(
          flightOptions.map(
            (flight) =>
              flight.airline,
          ),
        ),
      );
    }, [
      flightOptions,
    ]);

  /*
   * Apply filters.
   */
  const visibleFlights =
    useMemo(() => {
      let result =
        flightOptions;

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
      flightOptions,
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
    if (
      flight.id ===
      currentFlightId
    ) {
      return;
    }

    setSelectedFlight(
      flight,
    );
  };

  const handleConfirm =
    async () => {
      if (
        !selectedFlight ||
        selecting
      ) {
        return;
      }

      try {
        setSelecting(true);

        const result =
          await selectTripFlight(
            tripId,
            selectedFlight.id,
          );

        const newFlightId =
          result.provider_offer_id;

        setCurrentFlightId(
          newFlightId,
        );

        setFlightOptions(
          (previousOptions) =>
            previousOptions
              .filter(
                (flight) =>
                  !(
                    flight.persistedSnapshot &&
                    flight.id !==
                      newFlightId
                  ),
              )
              .map(
                (flight) => ({
                  ...flight,

                  current:
                    flight.id ===
                    newFlightId,
                }),
              ),
        );

        setSelectedFlight(
          undefined,
        );
      } catch (error) {
        console.error(
          "Failed to select flight:",
          error,
        );
      } finally {
        setSelecting(false);
      }
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
          currentFlight
            ?.convertedCurrency ??
          trip.currency
        }
        flightBudget={
          currentFlight
            ?.convertedPrice ??
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
                  flight={{
                    ...flight,
                    current:
                      flight.id ===
                      currentFlightId,
                  }}
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