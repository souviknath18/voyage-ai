"use client";

import {
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

import type {
  FlightComparisonOption,
  TripWorkspaceData,
} from "@/types/trip-workspace";

import {
  selectTripFlight,
  deleteSelectedTripFlight,
  getTripFlights,
  getSelectedTripFlight,
} from "@/lib/trips";

import {
  shortlistFlights,
  mapSelectedFlightToComparisonOption,
} from "@/lib/flight-mappers";

import { RefreshCw } from "lucide-react";

import FlightAIRefine from "./FlightAIRefine";
import FlightBudgetImpact from "./FlightBudgetImpact";
import FlightComparisonCard from "./FlightComparisonCard";
import FlightComparisonHeader from "./FlightComparisonHeader";
import FlightFilters from "./FlightFilters";
import { ApiError } from "@/lib/api";

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

  const [removing, setRemoving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefreshFlights = async () => {
    if (refreshing || selecting || removing) {
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

        setFlightOptions((previousOptions) =>
          previousOptions
            .filter((flight) => !flight.persistedSnapshot)
            .map((flight) => ({
              ...flight,
              current: false,
            })),
        );

        setSelectedFlight(undefined);

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
          />

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
              disabled={refreshing || selecting || removing}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-[#d1bcff] transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh Flights"}
            </button>
          </div>

          {/* Results */}
          {visibleFlights.length >
          0 ? (
            visibleFlights.map(
              (flight) => (
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