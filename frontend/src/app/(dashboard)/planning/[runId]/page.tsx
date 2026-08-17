"use client";

import {
  useParams,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import AgentActivityLog from "@/components/planning/AgentActivityLog";
import PlanningFailure from "./components/PlanningFailure";
import PlanningHeader from "@/components/planning/PlanningHeader";
import PlanningProgress from "@/components/planning/PlanningProgress";
import PlanningTripSummary from "@/components/planning/PlanningTripSummary";

import type {
  PlanningRun,
} from "@/types/planning";

const planningRun: PlanningRun = {
  runId: "run-tokyo-001",

  /*
   * Change this to:
   *
   * "failed"
   *
   * to preview the
   * Trip Planning Failure UI.
   */
  // status: "planning",
  status: "failed",

  progress: 58,

  trip: {
    id: "trip-tokyo-001",

    origin: "Bangalore",

    destination: "Tokyo",

    startDate: "10 Nov 2026",

    endDate: "15 Nov 2026",

    travelers: 1,

    currency: "INR",

    budget: 150000,

    pace: "Balanced",

    interests: [
      "Technology",
      "Food",
      "Photography",
    ],
  },

  steps: [
    {
      id: "preferences",

      title:
        "Understanding your preferences",

      description:
        "Analyzed your budget, travel pace and selected interests.",

      status:
        "completed",

      icon:
        "preferences",
    },

    {
      id: "flights",

      title:
        "Searching flight options",

      description:
        "Compared routes from Bangalore to Tokyo and shortlisted suitable options.",

      status:
        "completed",

      icon:
        "flight",
    },

    {
      id: "hotels",

      title:
        "Comparing hotels",

      description:
        "Evaluated hotels based on location, transport access and your target budget.",

      status:
        "completed",

      icon:
        "hotel",
    },

    {
      id:
        "budget-warning",

      title:
        "Budget alignment needed",

      description:
        "The initial plan exceeded your target budget. VoyageAI searched for more efficient accommodation options.",

      status:
        "warning",

      icon:
        "budget",
    },

    {
      id:
        "hotel-optimization",

      title:
        "Optimizing hotel selection",

      description:
        "Found a well-connected alternative that brings the estimated trip closer to budget.",

      status:
        "completed",

      icon:
        "hotel",
    },

    {
      id: "places",

      title:
        "Finding places matching your interests",

      description:
        "Searching technology experiences, local food spots, photography locations and major Tokyo attractions.",

      status:
        "running",

      icon:
        "places",
    },

    {
      id: "weather",

      title:
        "Checking destination weather",

      description:
        "Weather context will be used to improve daily activity placement.",

      status:
        "queued",

      icon:
        "weather",
    },

    {
      id: "cost",

      title:
        "Calculating estimated trip cost",

      description:
        "Flights, accommodation, food, transportation and activity estimates will be combined.",

      status:
        "queued",

      icon:
        "cost",
    },

    {
      id: "itinerary",

      title:
        "Optimizing itinerary",

      description:
        "VoyageAI will minimize unnecessary travel while balancing your preferred pace.",

      status:
        "queued",

      icon:
        "itinerary",
    },

    {
      id: "final",

      title:
        "Finalizing your trip",

      description:
        "Running final constraint and budget validation before creating your itinerary.",

      status:
        "queued",

      icon:
        "final",
    },
  ],
};

export default function PlanningPage() {
  const params =
    useParams<{
      runId: string;
    }>();

  const runId =
    params.runId;

  console.log(
    "Planning run:",
    runId,
  );

  const planning =
    planningRun.status ===
    "planning";

  const failed =
    planningRun.status ===
    "failed";

  /*
   * Failed Planning State
   */
  if (failed) {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
          <PlanningFailure
            tripId={
              planningRun
                .trip.id
            }
            runId={
              planningRun
                .runId
            }
            origin={
              planningRun
                .trip.origin
            }
            destination={
              planningRun
                .trip
                .destination
            }
            startDate={
              planningRun
                .trip.startDate
            }
            endDate={
              planningRun
                .trip.endDate
            }
            travelers={
              planningRun
                .trip
                .travelers
            }
            currency={
              planningRun
                .trip.currency
            }
            budget={
              planningRun
                .trip.budget
            }
            onRetryAction={() => {
              console.log(
                "Retry planning:",
                planningRun.runId,
              );

              /*
               * Later:
               *
               * POST
               * /api/v1/planning-runs/
               * {planningRun.runId}/retry
               */
            }}
          />
        </div>
      </AppLayout>
    );
  }

  /*
   * Normal Planning State
   */
  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-5">
          {/* Header */}
          <PlanningHeader
            running={
              planning
            }
          />

          {/* Trip Summary */}
          <PlanningTripSummary
            trip={
              planningRun.trip
            }
          />

          {/* Overall Progress */}
          <PlanningProgress
            progress={
              planningRun.progress
            }
          />

          {/* Agent Activity */}
          <AgentActivityLog
            steps={
              planningRun.steps
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}