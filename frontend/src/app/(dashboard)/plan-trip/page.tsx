"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";

import AIConciergeBrief from "@/components/plan-trip/AIConciergeBrief";
import BudgetTarget from "@/components/plan-trip/BudgetTarget";
import CoreTripDetails from "@/components/plan-trip/CoreTripDetails";
import ExpeditionSummary from "@/components/plan-trip/ExpeditionSummary";
import InterestSelector from "@/components/plan-trip/InterestSelector";
import PlanTripHero from "@/components/plan-trip/PlanTripHero";
import PrivacyCard from "@/components/plan-trip/PrivacyCard";
import TravelPaceSelector from "@/components/plan-trip/TravelPaceSelector";
import { createTrip } from "@/lib/trips";
import type { TripFormData } from "@/types/trip";

export default function PlanTripPage() {
  const router = useRouter();
  const [trip, setTrip] = useState<TripFormData>({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 2,
    currency: "INR",
    budget: 0,
    budgetLevel: 50,
    pace: "balanced",
    interests: [],
    aiBrief: "",
  });

  const [planning, setPlanning] = useState(false);

  const updateTrip = <K extends keyof TripFormData>(
    key: K,
    value: TripFormData[K],
  ) => {
    setTrip((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handlePlanTrip = async () => {
    if (!trip.origin.trim()) {
      alert("Please enter your origin.");
      return;
    }

    if (!trip.destination.trim()) {
      alert("Please enter your destination.");
      return;
    }

    if (!trip.startDate || !trip.endDate) {
      alert("Please select your travel dates.");
      return;
    }

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (endDate < startDate) {
      alert(
        "End date cannot be before the start date.",
      );
      return;
    }

    if (trip.travelers < 1) {
      alert(
        "At least one traveler is required.",
      );
      return;
    }

    if (trip.budget <= 0) {
      alert(
        "Please enter a valid trip budget.",
      );
      return;
    }

    setPlanning(true);

    try {
      const createdTrip = await createTrip({
        origin: trip.origin,
        destination: trip.destination,
        start_date: trip.startDate,
        end_date: trip.endDate,
        travelers: trip.travelers,
        budget: trip.budget,
        currency: trip.currency,
      });

      router.push(`/trips/${createdTrip.id}`);
    } catch (error) {
      console.error(
        "Failed to create trip:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create trip",
      );
    } finally {
      setPlanning(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-5">
          <PlanTripHero />

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-8">
              <CoreTripDetails
                origin={trip.origin}
                destination={trip.destination}
                startDate={trip.startDate}
                endDate={trip.endDate}
                travelers={trip.travelers}
                onOriginChangeAction={(value) =>
                  updateTrip(
                    "origin",
                    value,
                  )
                }
                onDestinationChangeAction={(value) =>
                  updateTrip(
                    "destination",
                    value,
                  )
                }
                onStartDateChangeAction={(value) =>
                  updateTrip(
                    "startDate",
                    value,
                  )
                }
                onEndDateChangeAction={(value) =>
                  updateTrip(
                    "endDate",
                    value,
                  )
                }
                onTravelersChangeAction={(value) =>
                  updateTrip(
                    "travelers",
                    value,
                  )
                }
              />

              {/* Budget + Pace */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <BudgetTarget
                  currency={trip.currency}
                  budget={trip.budget}
                  budgetLevel={
                    trip.budgetLevel
                  }
                  onCurrencyChangeAction={(value) =>
                    updateTrip(
                      "currency",
                      value,
                    )
                  }
                  onBudgetChangeAction={(value) =>
                    updateTrip(
                      "budget",
                      value,
                    )
                  }
                  onBudgetLevelChangeAction={(value) =>
                    updateTrip(
                      "budgetLevel",
                      value,
                    )
                  }
                />

                <TravelPaceSelector
                  value={trip.pace}
                  onChangeAction={(value) =>
                    updateTrip(
                      "pace",
                      value,
                    )
                  }
                />
              </div>

              {/* Interests */}
              <InterestSelector
                selected={trip.interests}
                onChangeAction={(value) =>
                  updateTrip(
                    "interests",
                    value,
                  )
                }
              />

              {/* AI Brief */}
              <AIConciergeBrief
                value={trip.aiBrief}
                onChangeAction={(value) =>
                  updateTrip(
                    "aiBrief",
                    value,
                  )
                }
              />
            </div>

            {/* Right Column */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-20 lg:z-30">
                <div className="space-y-4">
                  <ExpeditionSummary
                    trip={trip}
                    loading={planning}
                    onPlanAction={
                      handlePlanTrip
                    }
                  />

                  <PrivacyCard />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}