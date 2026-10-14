"use client";

import {
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

import type {
  FlightComparisonOption,
  FlightComparisonTripData ,
} from "@/types/trip-workspace";

import {
  selectTripFlight,
  deleteSelectedTripFlight,
  getTripFlights,
  getSelectedTripFlight,
  refineTripFlights,
} from "@/lib/trips";

import {
  shortlistFlights,
  mapFlightOffer,
  mapSelectedFlightToComparisonOption,
} from "@/lib/flight-mappers";

import { RefreshCw } from "lucide-react";

import FlightAIRefine from "./FlightAIRefine";
import FlightBudgetImpact from "./FlightBudgetImpact";
import FlightComparisonCard from "./FlightComparisonCard";
import FlightComparisonHeader from "./FlightComparisonHeader";
import FlightFilters from "./FlightFilters";
import { ApiError } from "@/lib/api";
import FlightResultsSkeleton from "./FlightResultsSkeleton";

interface FlightComparisonProps {
  trip: FlightComparisonTripData;
  tripId: string;

  onBackAction: () => void;
  onBudgetRefreshAction?: () => Promise<void>;
}

export default function FlightComparison({
  trip,
  tripId,
  onBackAction,
  onBudgetRefreshAction,
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

  const [removing, setRemoving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refining, setRefining] = useState(false);

  const [refinementExplanation, setRefinementExplanation] =
    useState<string | null>(null);

  const [originalFlightOptions, setOriginalFlightOptions] =
    useState<FlightComparisonOption[] | null>(null);

  const currentFlight = currentFlightId
    ? flightOptions.find(
        (flight) => flight.id === currentFlightId,
      )
    : undefined;

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

  
  const handleAIRefine = async (prompt: string) => {
    if (refining || refreshing || selecting || removing) {
      return;
    }

    try {
      setRefining(true);

      const response = await refineTripFlights(
        tripId,
        prompt,
      );

      // Preserve the original offers for restoration.
      setOriginalFlightOptions((previous) =>
        previous ?? flightOptions,
      );

      // Preserve the backend's refined ordering.
      const refinedOptions = response.offers.map(
        mapFlightOffer,
      );

      // Keep the currently selected flight visible,
      // even when it does not match the new preferences.
      const existingCurrentFlight = flightOptions.find(
        (flight) => flight.id === currentFlightId,
      );

      if (
        existingCurrentFlight &&
        !refinedOptions.some(
          (flight) => flight.id === currentFlightId,
        )
      ) {
        refinedOptions.unshift(existingCurrentFlight);
      }

      setFlightOptions(refinedOptions);
      setRefinementExplanation(response.explanation);

      // Reset manual filters so they do not hide
      // the AI-refined results.
      setNonStop(false);
      setOneStop(false);
      setSelectedAirlines([]);

      setSelectedFlight(undefined);

      toast.success("Flights refined", {
        description: response.explanation,
      });
    } catch (error) {
      console.error("Failed to refine flights:", error);

      toast.error("Unable to refine flights", {
        description:
          error instanceof ApiError
            ? error.message
            : "Please try again.",
      });
    } finally {
      setRefining(false);
    }
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

  const handleRefreshFlights = async () => {
    if (refreshing || refining || selecting || removing) {
      return;
    }

    try {
      setRefreshing(true);

      const [response, savedFlight] = await Promise.all([
        getTripFlights(tripId),
        getSelectedTripFlight(tripId),
      ]);

      const freshOptions = shortlistFlights(response.offers, 6);

      let updatedOptions: FlightComparisonOption[] =
        freshOptions.map((flight) => ({
          ...flight,
          current:
            savedFlight !== null &&
            flight.id === savedFlight.provider_offer_id,
        }));

      if (savedFlight) {
        const alreadyIncluded = updatedOptions.some(
          (flight) => flight.id === savedFlight.provider_offer_id,
        );

        if (!alreadyIncluded) {
          updatedOptions = [
            mapSelectedFlightToComparisonOption(savedFlight),
            ...updatedOptions,
          ];
        }
      }

      setFlightOptions(updatedOptions);
      setOriginalFlightOptions(null);
      setRefinementExplanation(null);
      setCurrentFlightId(savedFlight?.provider_offer_id);
      setSelectedFlight(undefined);

      toast.success("Flights refreshed", {
        description: "Updated flight offers are now available.",
      });
    } catch (error) {
      console.error("Failed to refresh flights:", error);

      toast.error("Unable to refresh flights", {
        description:
          "Please check your connection and try again.",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleRemoveFlight = async () => {
    if (!currentFlightId || removing) {
      return;
    }

    try {
      setRemoving(true);

      const result = await deleteSelectedTripFlight(tripId);

      if (result.deleted) {
        setCurrentFlightId(undefined);
        setOriginalFlightOptions((previous) =>
          previous
            ? previous
                .filter((flight) => !flight.persistedSnapshot)
                .map((flight) => ({
                  ...flight,
                  current: false,
                }))
            : null,
        );

        setFlightOptions((previousOptions) =>
          previousOptions
            .filter((flight) => !flight.persistedSnapshot)
            .map((flight) => ({
              ...flight,
              current: false,
            })),
        );

        setSelectedFlight(undefined);

        if (onBudgetRefreshAction) {
          try {
            await onBudgetRefreshAction();
          } catch (refreshError) {
            console.error(
              "Failed to refresh budget after removing flight:",
              refreshError,
            );
          }
        }

        // ADD: Success toast
        toast.success("Flight removed", {
          description:
            "The selected flight has been removed from your trip.",
        });
      }
    } catch (error) {
      console.error("Failed to remove selected flight:", error);

      // ADD: Error toast
      toast.error("Unable to remove flight", {
        description: "Please try again.",
      });
    } finally {
      setRemoving(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFlight || selecting) {
      return;
    }

    try {
      setSelecting(true);

      const result = await selectTripFlight(
        tripId,
        selectedFlight.id,
      );

      const newFlightId = result.provider_offer_id;

      setCurrentFlightId(newFlightId);

      setOriginalFlightOptions((previous) =>
        previous
          ? previous
              .filter(
                (flight) =>
                  !flight.persistedSnapshot ||
                  flight.id === newFlightId,
              )
              .map((flight) => ({
                ...flight,
                current: flight.id === newFlightId,
              }))
          : null,
      );

      setFlightOptions((previousOptions) =>
        previousOptions
          .filter(
            (flight) =>
              !(
                flight.persistedSnapshot &&
                flight.id !== newFlightId
              ),
          )
          .map((flight) => ({
            ...flight,
            current: flight.id === newFlightId,
          })),
      );

      setSelectedFlight(undefined);

      if (onBudgetRefreshAction) {
        try {
          await onBudgetRefreshAction();
        } catch (refreshError) {
          console.error(
            "Failed to refresh budget after selecting flight:",
            refreshError,
          );
        }
      }

      // ADD: Success toast
      toast.success("Flight selected successfully", {
        description:
          "Your selected flight has been saved to your trip.",
      });
    } catch (error) {
      console.error("Failed to select flight:", error);

      if (error instanceof ApiError && error.status === 409) {
        toast.error("Flight offer expired", {
          description:
            "This flight offer has expired. Please search for updated flights.",
        });
      } else if (
        error instanceof ApiError &&
        error.status === 404
      ) {
        toast.error("Flight unavailable", {
          description:
            "This flight is no longer available. Please search again.",
        });
      } else if (error instanceof ApiError) {
        toast.error("Unable to select flight", {
          description: error.message,
        });
      } else {
        toast.error("Connection error", {
          description:
            "Unable to complete your request. Please try again.",
        });
      }
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
            onSubmitAction={handleAIRefine}
            refining={refining}
          />

          {refining && (
            <p className="text-xs text-[#d1bcff]" role="status">
              VoyageAI is refining your flights...
            </p>
          )}

          {refinementExplanation && !refining && (
            <div
              role="status"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d1bcff]/20 bg-[#d1bcff]/[0.05] px-4 py-3"
            >
              <p className="text-xs text-[#d1bcff]">
                {refinementExplanation}
              </p>

              <button
                type="button"
                onClick={() => {
                  if (originalFlightOptions) {
                    const restoredOptions = originalFlightOptions
                      .filter(
                        (flight) =>
                          !flight.persistedSnapshot ||
                          flight.id === currentFlightId,
                      )
                      .map((flight) => ({
                        ...flight,
                        current: flight.id === currentFlightId,
                      }));

                    const selectedCurrentFlight = flightOptions.find(
                      (flight) => flight.id === currentFlightId,
                    );

                    if (
                      selectedCurrentFlight &&
                      !restoredOptions.some(
                        (flight) => flight.id === currentFlightId,
                      )
                    ) {
                      restoredOptions.unshift({
                        ...selectedCurrentFlight,
                        current: true,
                      });
                    }

                    setFlightOptions(restoredOptions);
                  }

                  setOriginalFlightOptions(null);
                  setRefinementExplanation(null);
                  setNonStop(false);
                  setOneStop(false);
                  setSelectedAirlines([]);
                }}
                className="text-xs font-semibold text-[#e6e0e8] transition hover:text-[#fb7185]"
              >
                Clear AI Refinement
              </button>
            </div>
          )}

          {/* Refresh Flights */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[#e6e0e8]">
                Available Flights
              </h2>
              <p className="mt-1 text-xs text-[#948e9c]">
                Compare the latest flight offers
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefreshFlights}
              disabled={refreshing || refining || selecting || removing}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-[#d1bcff] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh Flights"}
            </button>
          </div>

          {/* Results */}
          <div aria-busy={refreshing}>
            {refreshing ? (
              <FlightResultsSkeleton />
            ) : visibleFlights.length > 0 ? (
              <div className="space-y-4">
                {visibleFlights.map((flight) => (
                  <FlightComparisonCard
                    key={flight.id}
                    flight={{
                      ...flight,
                      current: flight.id === currentFlightId,
                    }}
                    currency={trip.currency}
                    onSelectAction={handleSelectFlight}
                    onRemoveAction={handleRemoveFlight}
                    removing={removing}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-14 text-center">
                <h2 className="text-sm font-semibold text-[#e6e0e8]">
                  No matching flights
                </h2>

                <p className="mt-2 text-xs text-[#948e9c]">
                  Try changing your filters or ask VoyageAI
                  to search differently.
                </p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 text-xs font-semibold text-[#d1bcff] transition hover:text-[#fb7185]"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================== */}
      {/* Budget Impact Modal */}
      {/* ========================== */}

      {selectedFlight &&
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
      }
    </div>
  );
}