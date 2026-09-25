"use client";

import {
  useEffect,
  useRef,
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
  setTripDestination,
  setTripOrigin,
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
    originLocation: null,
    destinationLocation: null,
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
  const planningRequestLock = useRef(false);

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

            originLocation:
              existingTrip.origin_name &&
              existingTrip.origin_country &&
              existingTrip.origin_country_code &&
              existingTrip.origin_latitude &&
              existingTrip.origin_longitude
                ? {
                    id: `origin-${existingTrip.id}`,
                    name: existingTrip.origin_name,
                    formattedName: existingTrip.origin,
                    country: existingTrip.origin_country,
                    countryCode: existingTrip.origin_country_code,
                    latitude: Number(existingTrip.origin_latitude),
                    longitude: Number(existingTrip.origin_longitude),
                    timezone: existingTrip.origin_timezone ?? undefined,
                  }
                : null,

            destination:
              existingTrip.destination,

            destinationLocation:
              existingTrip.destination_name &&
              existingTrip.destination_country &&
              existingTrip.destination_country_code &&
              existingTrip.destination_latitude &&
              existingTrip.destination_longitude
                ? {
                    id: `destination-${existingTrip.id}`,
                    name: existingTrip.destination_name,
                    formattedName: existingTrip.destination,
                    country: existingTrip.destination_country,
                    countryCode: existingTrip.destination_country_code,
                    latitude: Number(existingTrip.destination_latitude),
                    longitude: Number(existingTrip.destination_longitude),
                    timezone: existingTrip.destination_timezone ?? undefined,
                  }
                : null,

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
    // Prevent duplicate requests from rapid double-clicks.
    if (planningRequestLock.current) {
      return;
    }

    if (!trip.origin.trim()) {
      alert("Please enter your origin.");
      return;
    }

    if (!trip.originLocation) {
      alert("Please select an origin from the suggestions.");
      return;
    }

    if (!trip.destination.trim()) {
      alert("Please enter your destination.");
      return;
    }

    if (!trip.destinationLocation) {
      alert("Please select a destination from the suggestions.");
      return;
    }

    if (!trip.startDate || !trip.endDate) {
      alert("Please select your travel dates.");
      return;
    }

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (endDate <= startDate) {
      alert("End date must be after the start date.");
      return;
    }

    if (trip.travelers < 1) {
      alert("At least one traveler is required.");
      return;
    }

    if (trip.budget <= 0) {
      alert("Please enter a valid trip budget.");
      return;
    }

    // Lock immediately before starting API work.
    planningRequestLock.current = true;
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

      const savedTrip = draftTripId
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

      await setTripOrigin(
        savedTrip.trip_id,
        {
          name:
            trip.originLocation.name,
          country:
            trip.originLocation.country,
          country_code:
            trip.originLocation.countryCode,
          latitude:
            trip.originLocation.latitude,
          longitude:
            trip.originLocation.longitude,
          timezone:
            trip.originLocation.timezone,
        },
      );

      await setTripDestination(
        savedTrip.trip_id,
        {
          name:
            trip.destinationLocation.name,
          country:
            trip.destinationLocation.country,
          country_code:
            trip.destinationLocation.countryCode,
          latitude:
            trip.destinationLocation.latitude,
          longitude:
            trip.destinationLocation.longitude,
          timezone:
            trip.destinationLocation.timezone,
        },
      );

      const agentRun = await planTrip(
        savedTrip.trip_id,
      );

      router.push(
        `/planning/${agentRun.id}`,
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
      planningRequestLock.current = false;
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
                originLocation={trip.originLocation}
                destinationLocation={trip.destinationLocation}
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

                onOriginLocationSelectAction={(location) =>
                  updateTripField(
                    "originLocation",
                    location,
                  )
                }

                onDestinationLocationSelectAction={(location) =>
                  updateTripField(
                    "destinationLocation",
                    location,
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