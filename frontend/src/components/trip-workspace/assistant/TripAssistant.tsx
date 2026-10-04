"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

import {
  applyTripAssistantProposal,
  sendTripAssistantMessage,
} from "@/lib/trips";

import type {
  AssistantMessage,
  AssistantProposalData,
  AssistantStep,
  TripChangeProposal,
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
    id: "assistant-welcome",
    role: "assistant",
    content:
      "Ask me anything about your trip, or tell me what you'd like to change.",
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
  const router = useRouter();

  const [
    proposal,
    setProposal,
  ] = useState<TripChangeProposal | null>(
    null,
  );

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    applying,
    setApplying,
  ] = useState(false);

  const [
    messages,
    setMessages,
  ] =
    useState<AssistantMessage[]>(
      initialMessages,
    );

  const handleSubmit = async (
    message: string,
  ) => {
    if (sending) {
      return;
    }

    const userMessage: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setSending(true);

    try {
      const response =
        await sendTripAssistantMessage(
          trip.id,
          message,
        );

      const assistantMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      if (
        response.action ===
          "change_requested" &&
        response.proposal
      ) {
        setProposal(response.proposal);
      } else {
        setProposal(null);
      }
    } catch (error) {
      console.error(
        "Failed to send assistant message:",
        error,
      );

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I couldn't process that request. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleApplyProposal = async () => {
    if (!proposal || applying) {
      return;
    }

    setApplying(true);

    try {
      const run =
        await applyTripAssistantProposal(
          trip.id,
          proposal,
        );

      router.push(
        `/planning/${run.id}`,
      );
    } catch (error) {
      console.error(
        "Failed to apply assistant proposal:",
        error,
      );

      setApplying(false);
    }
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

            {sending && (
              <AssistantThinking
                steps={mockSteps}
              />
            )}

            {false && (
              <AssistantProposal
                proposal={mockProposal}
                onAcceptAction={
                  handleApplyProposal
                }
                onRejectAction={() =>
                  setProposal(null)
                }
                onDiscussAction={() =>
                  console.log(
                    "Discuss options",
                  )
                }
              />
            )}
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