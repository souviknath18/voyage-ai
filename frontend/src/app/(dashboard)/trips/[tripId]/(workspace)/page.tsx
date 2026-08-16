"use client";

import {
  useRouter,
} from "next/navigation";

import TripAIOverview from "@/components/trip-workspace/TripAIOverview";
import TripBudgetOverview from "@/components/trip-workspace/TripBudgetOverview";
import TripFlightCard from "@/components/trip-workspace/TripFlightCard";
import TripHighlights from "@/components/trip-workspace/TripHighlights";
import TripHotelCard from "@/components/trip-workspace/TripHotelCard";
import TripOptimizationActions from "@/components/trip-workspace/TripOptimizationActions";
import TripWarningCard from "@/components/trip-workspace/TripWarningCard";
import TripWeatherCard from "@/components/trip-workspace/TripWeatherCard";

import {
  mockTrip,
} from "@/data/mock-trip";

export default function TripOverviewPage() {
  const router =
    useRouter();

  const trip =
    mockTrip;

  const handleResolveConflict =
    () => {
      console.log(
        "Resolve conflict",
      );

      /*
       * Later:
       * Open VoyageAI conflict-resolution flow.
       */
    };

  const handleOptimizationPreset = (
    type: string,
  ) => {
    console.log(
      "Optimization:",
      type,
    );

    /*
     * For now send the user
     * to the optimization page.
     *
     * Later you can also preselect
     * the optimization type.
     */
    router.push(
      `/trips/${trip.id}/optimize`,
    );
  };

  return (
    <div className="space-y-5">
      {/* AI + Warning */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TripAIOverview
            summary={
              trip.aiSummary
            }
          />
        </div>

        {trip.warning && (
          <div className="lg:col-span-4">
            <TripWarningCard
              title={
                trip.warning.title
              }
              description={
                trip.warning
                  .description
              }
              onResolveAction={
                handleResolveConflict
              }
            />
          </div>
        )}
      </div>

      {/* Travel Details */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <TripFlightCard
            flights={
              trip.flights
            }
            onCompareAction={() =>
              router.push(
                `/trips/${trip.id}/flights`,
              )
            }
          />
        </div>

        <div className="lg:col-span-5">
          <TripHotelCard
            hotel={trip.hotel}
            onViewDetailsAction={() =>
              router.push(
                `/trips/${trip.id}/hotels/${trip.hotel.id}`,
              )
            }
            onCompareAction={() =>
              router.push(
                `/trips/${trip.id}/hotels`,
              )
            }
          />
        </div>

        <div className="lg:col-span-2">
          <TripWeatherCard
            weather={
              trip.weather
            }
          />
        </div>
      </div>

      {/* Budget + Highlights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TripBudgetOverview
          currency={
            trip.currency
          }
          totalBudget={
            trip.totalBudget
          }
          estimatedCost={
            trip.estimatedCost
          }
          items={
            trip.budgetBreakdown
          }
        />

        <TripHighlights
          highlights={
            trip.highlights
          }
        />
      </div>

      {/* Optimization */}
      <TripOptimizationActions
        onOptimizeAction={
          handleOptimizationPreset
        }
      />
    </div>
  );
}