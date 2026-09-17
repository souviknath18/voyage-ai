"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";

import AIConciergeBrief from "@/components/plan-trip/AIConciergeBrief";
import BudgetTarget from "@/components/plan-trip/BudgetTarget";
import CoreTripDetails from "@/components/plan-trip/CoreTripDetails";
import ExpeditionSummary from "@/components/plan-trip/ExpeditionSummary";
import InterestSelector from "@/components/plan-trip/InterestSelector";
import PlanTripHero from "@/components/plan-trip/PlanTripHero";
import PrivacyCard from "@/components/plan-trip/PrivacyCard";
import TravelPaceSelector from "@/components/plan-trip/TravelPaceSelector";
import {
  createTrip,
  getTrip,
  getTripPreferences,
  saveTripPreferences,
  updateTrip,
  planTrip,
} from "@/lib/trips";
import { PageLoader } from "@/components/ui";
import type { TripFormData } from "@/types/trip";

export default function PlanTripPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftTripId = searchParams.get("draft");
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
  const [loadingDraft, setLoadingDraft] = useState(false);

  useEffect(() => {
    if (!draftTripId) {
      return;
    }

    const loadDraftTrip =
      async () => {
        try {
          setLoadingDraft(true);

          const existingTrip =
            await getTrip(draftTripId);

          let preferences = null;

          try {
            preferences =
              await getTripPreferences(
                draftTripId,
              );
          } catch (error) {
            console.warn(
              "No saved preferences found:",
              error,
            );
          }

          setTrip((previous) => ({
            ...previous,

            origin: existingTrip.origin,
            destination:
              existingTrip.destination,

            startDate:
              existingTrip.start_date,
            endDate:
              existingTrip.end_date,

            travelers:
              existingTrip.travelers,

            budget:
              existingTrip.budget
                ? Number(existingTrip.budget)
                : 0,

            currency:
              existingTrip.currency,

            pace:
              preferences?.pace ??
              previous.pace,

            interests:
              preferences?.interests ??
              previous.interests,

            aiBrief:
              preferences?.ai_brief ??
              previous.aiBrief,

            budgetLevel:
              preferences?.budget_level ??
              previous.budgetLevel,
          }));
        } catch (error) {
          console.error(
            "Failed to load draft trip:",
            error,
          );

          alert(
            error instanceof Error
              ? error.message
              : "Failed to load draft trip",
          );
        } finally {
          setLoadingDraft(false);
        }
      };

    loadDraftTrip();
  }, [draftTripId]);

  const updateTripField = <K extends keyof TripFormData>(
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

    if (endDate <= startDate) {
      alert(
        "End date must be after the start date.",
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
      const payload = {
        origin: trip.origin,
        destination: trip.destination,
        start_date: trip.startDate,
        end_date: trip.endDate,
        travelers: trip.travelers,
        budget: trip.budget,
        currency: trip.currency,
      };

      const savedTrip =
        draftTripId
          ? await updateTrip(
              draftTripId,
              payload,
            )
          : await createTrip(
              payload,
            );

      await saveTripPreferences(
        savedTrip.trip_id,
        {
          pace: trip.pace,
          interests: trip.interests,
          ai_brief:
            trip.aiBrief.trim() || null,
          budget_level:
            trip.budgetLevel,
        },
      );

      // Start AI itinerary planning
      const agentRun = await planTrip(
        savedTrip.trip_id,
      );

      if (agentRun.status === "failed") {
        throw new Error(
          agentRun.error_message ||
            "AI trip planning failed.",
        );
      }

      if (agentRun.status !== "completed") {
        throw new Error(
          "AI trip planning did not complete.",
        );
      }

      router.push(
        `/trips/${savedTrip.trip_id}`,
      );
    } catch (error) {
      console.error(
        "Failed to plan trip:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to plan trip",
      );
    } finally {
      setPlanning(false);
    }
  };

  if (loadingDraft) {
    return (
      <AppLayout>
        <PageLoader
          title="Loading your trip"
          description="VoyageAI is retrieving your draft."
        />
      </AppLayout>
    );
  }

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
                  updateTripField(
                    "origin",
                    value,
                  )
                }
                onDestinationChangeAction={(value) =>
                  updateTripField(
                    "destination",
                    value,
                  )
                }
                onStartDateChangeAction={(value) =>
                  updateTripField(
                    "startDate",
                    value,
                  )
                }
                onEndDateChangeAction={(value) =>
                  updateTripField(
                    "endDate",
                    value,
                  )
                }
                onTravelersChangeAction={(value) =>
                  updateTripField(
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
                    updateTripField(
                      "currency",
                      value,
                    )
                  }
                  onBudgetChangeAction={(value) =>
                    updateTripField(
                      "budget",
                      value,
                    )
                  }
                  onBudgetLevelChangeAction={(value) =>
                    updateTripField(
                      "budgetLevel",
                      value,
                    )
                  }
                />

                <TravelPaceSelector
                  value={trip.pace}
                  onChangeAction={(value) =>
                    updateTripField(
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
                  updateTripField(
                    "interests",
                    value,
                  )
                }
              />

              {/* AI Brief */}
              <AIConciergeBrief
                value={trip.aiBrief}
                onChangeAction={(value) =>
                  updateTripField(
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