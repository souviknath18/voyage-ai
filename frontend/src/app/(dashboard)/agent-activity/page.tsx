"use client";

import {
  useState,
} from "react";

import AppLayout from "@/components/layout/AppLayout";

import AgentActivityHeader from "@/components/agent-activity/AgentActivityHeader";
import AgentRunDetails from "@/components/agent-activity/AgentRunDetails";
import AgentRunList from "@/components/agent-activity/AgentRunList";

import type {
  GlobalAgentRun,
} from "@/types/agent-activity";

const mockRuns: GlobalAgentRun[] = [
  {
    id:
      "VX-1025",

    tripId:
      "amalfi-001",

    title:
      "Amalfi Coast Optimization",

    destination:
      "Amalfi Coast, Italy",

    image:
      "/images/explore/amalfi.jpg",

    status:
      "running",

    createdAt:
      "Just now",

    elapsedTime:
      "00:22",

    completedSteps:
      4,

    totalSteps:
      6,

    events: [
      {
        id:
          "event-request",

        title:
          "Request Parsed",

        description:
          "Trip optimization preferences were validated and prepared for processing.",

        status:
          "completed",

        type:
          "request",

        duration:
          "1.1s",

        result:
          "Optimization constraints prepared",
      },

      {
        id:
          "event-flight",

        title:
          "Flight Search",

        description:
          "VoyageAI compared alternative return flights while preserving your preferred travel dates.",

        status:
          "completed",

        type:
          "flight",

        provider:
          "Flight Search API",

        duration:
          "7.2s",

        result:
          "23 options compared",
      },

      {
        id:
          "event-warning",

        title:
          "Accommodation Constraint",

        description:
          "The current hotel did not fully match the requested quiet-room preference.",

        status:
          "warning",

        type:
          "hotel",

        duration:
          "0.4s",

        result:
          "Alternative required",
      },

      {
        id:
          "event-replan",

        title:
          "Autonomous Re-planning",

        description:
          "VoyageAI is evaluating alternative boutique hotels with better location and noise-isolation characteristics.",

        status:
          "running",

        type:
          "optimization",

        duration:
          "4.8s",
      },

      {
        id:
          "event-validation",

        title:
          "Constraint Validation",

        description:
          "The updated plan will be checked against budget, dates and saved preferences.",

        status:
          "queued",

        type:
          "validation",
      },

      {
        id:
          "event-final",

        title:
          "Finalize Updated Trip",

        description:
          "VoyageAI will prepare the proposed itinerary changes for review.",

        status:
          "queued",

        type:
          "itinerary",
      },
    ],
  },

  {
    id:
      "VX-1024",

    tripId:
      "tokyo-001",

    title:
      "Tokyo Autumn Itinerary",

    destination:
      "Tokyo, Japan",

    image:
      "/images/explore/tokyo.jpg",

    status:
      "completed",

    createdAt:
      "2h ago",

    elapsedTime:
      "00:38",

    completedSteps:
      7,

    totalSteps:
      7,

    events: [
      {
        id:
          "tokyo-request",

        title:
          "Trip Request Parsed",

        description:
          "Dates, budget, pace and travel interests were validated.",

        status:
          "completed",

        type:
          "request",

        duration:
          "1.0s",
      },

      {
        id:
          "tokyo-flight",

        title:
          "Flight Search",

        description:
          "Flights from Bangalore to Tokyo were compared.",

        status:
          "completed",

        type:
          "flight",

        provider:
          "Flight Search API",

        duration:
          "7.2s",

        result:
          "23 options compared",
      },

      {
        id:
          "tokyo-hotel",

        title:
          "Hotel Search",

        description:
          "Hotels were ranked based on budget and itinerary proximity.",

        status:
          "completed",

        type:
          "hotel",

        duration:
          "5.8s",

        result:
          "18 hotels evaluated",
      },

      {
        id:
          "tokyo-places",

        title:
          "Places Matched",

        description:
          "Technology, food and photography experiences were ranked.",

        status:
          "completed",

        type:
          "places",

        duration:
          "3.9s",
      },

      {
        id:
          "tokyo-budget",

        title:
          "Budget Validation",

        description:
          "Projected costs were checked against the selected budget.",

        status:
          "completed",

        type:
          "budget",

        duration:
          "1.5s",
      },

      {
        id:
          "tokyo-itinerary",

        title:
          "Itinerary Optimized",

        description:
          "Activities were grouped geographically to reduce unnecessary transit.",

        status:
          "completed",

        type:
          "itinerary",

        duration:
          "6.2s",
      },

      {
        id:
          "tokyo-final",

        title:
          "Final Validation",

        description:
          "Flight, hotel, itinerary and budget constraints passed validation.",

        status:
          "completed",

        type:
          "validation",

        duration:
          "2.1s",

        result:
          "Trip ready",
      },
    ],
  },

  {
    id:
      "VX-1023",

    title:
      "Swiss Alps Ski Lodge",

    destination:
      "Zermatt, Switzerland",

    image:
      "/images/explore/zermatt.jpg",

    status:
      "failed",

    createdAt:
      "Yesterday",

    elapsedTime:
      "00:17",

    completedSteps:
      2,

    totalSteps:
      5,

    events: [
      {
        id:
          "swiss-request",

        title:
          "Request Parsed",

        description:
          "Trip requirements were successfully validated.",

        status:
          "completed",

        type:
          "request",

        duration:
          "0.9s",
      },

      {
        id:
          "swiss-hotel",

        title:
          "Hotel Search",

        description:
          "VoyageAI started searching mountain accommodation.",

        status:
          "completed",

        type:
          "hotel",

        duration:
          "5.1s",
      },

      {
        id:
          "swiss-error",

        title:
          "Hotel Provider Timeout",

        description:
          "The accommodation provider did not respond within the configured timeout window.",

        status:
          "failed",

        type:
          "hotel",

        provider:
          "Hotel Search API",

        duration:
          "10.4s",

        result:
          "Run stopped",
      },

      {
        id:
          "swiss-validation",

        title:
          "Budget Validation",

        status:
          "queued",

        type:
          "budget",
      },

      {
        id:
          "swiss-final",

        title:
          "Finalize Trip",

        status:
          "queued",

        type:
          "validation",
      },
    ],
  },
];

export default function AgentActivityPage() {
  const [
    selectedRunId,
    setSelectedRunId,
  ] = useState(
    mockRuns[0].id,
  );

  const selectedRun =
    mockRuns.find(
      (run) =>
        run.id ===
        selectedRunId,
    ) ??
    mockRuns[0];

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-6">
          <AgentActivityHeader />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr] xl:grid-cols-[310px_1fr]">
            <AgentRunList
              runs={
                mockRuns
              }
              selectedRunId={
                selectedRunId
              }
              onSelectAction={
                setSelectedRunId
              }
            />

            <AgentRunDetails
              run={
                selectedRun
              }
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}