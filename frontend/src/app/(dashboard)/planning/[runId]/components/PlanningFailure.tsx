"use client";

import {
  AlertCircle,
  ArrowLeft,
  Bot,
  RefreshCw,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import type {
  PlanningStep,
} from "@/types/planning";

import {
  Button,
  Card,
} from "@/components/ui";

import PlanningFailureProgress from "./PlanningFailureProgress";
import PlanningFailureTripSummary from "./PlanningFailureTripSummary";

interface PlanningFailureProps {
  tripId: string;
  runId: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  currency: string;
  budget: number;

  errorMessage?: string | null;
  steps: PlanningStep[];
  retrying?: boolean;

  onRetryAction: () => void;
}

export default function PlanningFailure({
  tripId,
  origin,
  destination,
  startDate,
  endDate,
  travelers,
  currency,
  budget,
  errorMessage,
  steps,
  retrying = false,
  onRetryAction,
}: PlanningFailureProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (retrying) {
      return;
    }

    onRetryAction();
  };


  const handleEdit =
    () => {
      /*
       * Later you can fetch
       * the existing trip draft
       * using tripId and repopulate
       * /plan-trip.
       */

      router.push(
        `/plan-trip?edit=${tripId}`,
      );
    };

  const handleDashboard =
    () => {
      router.push(
        "/dashboard",
      );
    };

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center pb-32 pt-4 sm:pb-6 sm:pt-6">
      <div className="w-full max-w-[760px]">
        <Card className="relative overflow-hidden border-white/10 p-5 sm:p-6 lg:p-7">
          {/* Top Accent */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#fb7185] to-transparent opacity-70" />

          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#fb7185]/25 bg-[#fb7185]/10 text-[#fb7185]">
              <AlertCircle
                size={21}
              />
            </div>

            <h1 className="mt-4 text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
              We couldn&apos;t finish planning your trip
            </h1>

            <p className="mx-auto mt-2 max-w-[500px] text-sm leading-6 text-[#948e9c]">
              VoyageAI ran into a problem while creating your itinerary. Your trip details and preferences are safe.
            </p>
          </div>

          {/* Summary + Progress */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <PlanningFailureTripSummary
              origin={
                origin
              }
              destination={
                destination
              }
              startDate={
                startDate
              }
              endDate={
                endDate
              }
              travelers={
                travelers
              }
              currency={
                currency
              }
              budget={
                budget
              }
            />

            <PlanningFailureProgress
              steps={steps}
            />
          </div>

          {/* Agent Status */}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#d1bcff]/20 bg-[#d1bcff]/10 text-[#d1bcff]">
              <Bot
                size={15}
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#e6e0e8] sm:text-[13px]">
                VoyageAI Agent Status
              </p>

              <p className="mt-1 text-xs leading-5 text-[#948e9c]">
                {errorMessage
                  ? errorMessage
                  : "The planning agent couldn't complete the itinerary. You can retry without losing your trip details."}
              </p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="mt-6 hidden items-center justify-center gap-3 border-t border-white/10 pt-5 sm:flex">
            <Button
              variant="outline"
              size="md"
              onClick={
                handleEdit
              }
            >
              Edit Trip Details
            </Button>

            <Button
              size="md"
              onClick={handleRetry}
              disabled={retrying}
            >
              <RefreshCw
                size={14}
                className={retrying ? "animate-spin" : ""}
              />

              {retrying
                ? "Starting again..."
                : "Try Again"}
            </Button>
          </div>

          {/* Dashboard Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={
                handleDashboard
              }
              className="inline-flex items-center gap-1.5 text-xs text-[#7f8798] transition hover:text-[#fb7185]"
            >
              <ArrowLeft
                size={13}
              />

              Return to Dashboard
            </button>
          </div>
        </Card>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#070B18] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 sm:hidden">
        <div className="mx-auto flex w-full max-w-md flex-col gap-2">
          {/* Try Again */}
          <Button
            fullWidth
            size="md"
            onClick={
              handleRetry
            }
            className="h-11 text-sm font-semibold"
          >
            <RefreshCw
              size={15}
            />

            Try Again
          </Button>

          {/* Edit Details */}
          <Button
            fullWidth
            variant="outline"
            size="md"
            onClick={
              handleEdit
            }
            className="h-11 text-sm font-medium"
          >
            Edit Details
          </Button>
        </div>
      </div>
    </div>
  );
}