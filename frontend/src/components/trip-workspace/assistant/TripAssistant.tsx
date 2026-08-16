"use client";

import {
  useState,
} from "react";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

import type {
  AssistantMessage,
  AssistantProposalData,
  AssistantStep,
} from "@/types/trip-assistant";

import AssistantComposer from "./AssistantComposer";
import AssistantMessageItem from "./AssistantMessage";
import AssistantProposal from "./AssistantProposal";
import AssistantThinking from "./AssistantThinking";
import TripAssistantContext from "./TripAssistantContext";
import TripAssistantHeader from "./TripAssistantHeader";

interface TripAssistantProps {
  trip: TripWorkspaceData;

  onBackAction: () => void;
}

const initialMessages: AssistantMessage[] = [
  {
    id: "message-1",

    role: "user",

    content:
      "Can you find me a better hotel without making the trip much more expensive?",

    time: "2:18 PM",
  },

  {
    id: "message-2",

    role: "assistant",

    content:
      "Yes. I can compare hotels that fit your current itinerary, maintain good transport access and keep the total trip close to your existing budget.",
  },
];

const mockSteps: AssistantStep[] = [
  {
    id: "step-1",

    title:
      "Reading current hotel and trip budget",

    status:
      "completed",
  },

  {
    id: "step-2",

    title:
      "Comparing hotels near planned activities",

    status:
      "completed",
  },

  {
    id: "step-3",

    title:
      "Checking budget impact",

    status:
      "running",
  },

  {
    id: "step-4",

    title:
      "Preparing proposed change",

    status:
      "queued",
  },
];

const mockProposal: AssistantProposalData = {
  id:
    "proposal-hotel",

  title:
    "I found a better hotel option",

  description:
    "This alternative gives you better access to Shibuya and central Tokyo while keeping the additional trip cost relatively small.",

  impact:
    "+ INR 4,500 total",

  current: {
    title:
      "Shinjuku Granbell Hotel",

    subtitle:
      "Superior Double Room",

    image:
      "/images/hotels/shinjuku.jpg",

    details: [
      "Shinjuku",
      "5 nights",
      "Good transport access",
    ],

    amount:
      "INR 42,000",
  },

  proposed: {
    title:
      "Shibuya Stream Excel Hotel Tokyu",

    subtitle:
      "Standard Double Room",

    image:
      "/images/hotels/shibuya.jpg",

    details: [
      "Shibuya",
      "5 nights",
      "Closer to Day 2 activities",
    ],

    amount:
      "INR 46,500",

    label:
      "VoyageAI Pick",
  },
};

export default function TripAssistant({
  trip,
  onBackAction,
}: TripAssistantProps) {
  const [
    messages,
    setMessages,
  ] =
    useState<AssistantMessage[]>(
      initialMessages,
    );

  const handleSubmit = (
    message: string,
  ) => {
    setMessages(
      (previous) => [
        ...previous,

        {
          id:
            crypto.randomUUID(),

          role:
            "user",

          content:
            message,
        },
      ],
    );
  };

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A0F1F]">
      {/* Left Trip Context */}
      <TripAssistantContext
        trip={trip}
      />

      {/* Assistant */}
      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* ================================= */}
        {/* ALWAYS VISIBLE TOP */}
        {/* ================================= */}

        <div className="relative z-20 shrink-0 bg-[#0A0F1F]">
          <TripAssistantHeader
            destination={
              trip.destination
            }
            onBackAction={
              onBackAction
            }
          />
        </div>

        {/* ================================= */}
        {/* ONLY SCROLLABLE SECTION */}
        {/* ================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-5 sm:px-6">
            {messages.map(
              (message) => (
                <AssistantMessageItem
                  key={
                    message.id
                  }
                  message={
                    message
                  }
                />
              ),
            )}

            <AssistantThinking
              steps={
                mockSteps
              }
            />

            <AssistantProposal
              proposal={
                mockProposal
              }
              onAcceptAction={() =>
                console.log(
                  "Accept proposal",
                )
              }
              onRejectAction={() =>
                console.log(
                  "Keep current",
                )
              }
              onDiscussAction={() =>
                console.log(
                  "Discuss options",
                )
              }
            />
          </div>
        </div>

        {/* ================================= */}
        {/* ALWAYS VISIBLE BOTTOM */}
        {/* ================================= */}

        <div className="relative z-20 shrink-0 bg-[#0A0F1F]">
          <AssistantComposer
            onSubmitAction={
              handleSubmit
            }
          />
        </div>
      </section>
    </div>
  );
}