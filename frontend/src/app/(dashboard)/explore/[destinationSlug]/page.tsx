
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  Compass,
  RefreshCw,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import { getExploreDestinationById } from "@/lib/api";

import type { ExploreDestinationApi } from "@/types/explore";

import DestinationHero from "@/components/explore/detail/DestinationHero";
import DestinationOverview from "@/components/explore/detail/DestinationOverview";
import DestinationAttractions from "@/components/explore/detail/DestinationAttractions";
import DestinationTravelContext from "@/components/explore/detail/DestinationTravelContext";
import DestinationCredits from "@/components/explore/detail/DestinationCredits";

export default function ExploreDestinationPage() {
  const { destinationSlug } =
    useParams<{ destinationSlug: string }>();

  const [destination, setDestination] =
    useState<ExploreDestinationApi | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setDestination(null);

    async function loadDestination() {
      try {
        const result = await getExploreDestinationById(
          destinationSlug,
        );

        if (!cancelled) {
          setDestination(result);
        }
      } catch (err) {
        console.error(
          "Failed to load Explore destination:",
          err,
        );

        if (!cancelled) {
          setError(
            "Unable to load destination details. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDestination();

    return () => {
      cancelled = true;
    };
  }, [destinationSlug, retryVersion]);

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 pt-5 md:px-6 md:pt-6">
        {/* Page header */}
        <header className="mb-5">
          <div className="flex items-center gap-2">
            <Compass
              size={19}
              className="text-[#fb7185]"
            />

            <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
              Destination Details
            </h1>
          </div>

          <p className="mt-1.5 text-sm text-[#948e9c]">
            Explore destination highlights and start
            planning your next journey.
          </p>
        </header>

        {/* Loading skeleton */}
        {loading ? (
          <div
            role="status"
            className="animate-pulse space-y-5"
          >
            <div className="h-[370px] rounded-xl border border-white/10 bg-white/[0.05] sm:h-[430px]" />

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="h-48 rounded-xl bg-white/[0.05] lg:col-span-2" />

              <div className="h-48 rounded-xl bg-white/[0.05]" />
            </div>

            <span className="sr-only">
              Loading destination details
            </span>
          </div>
        ) : error || !destination ? (
          /* Error / empty state */
          <div
            role="alert"
            className="rounded-xl border border-white/10 bg-white/[0.04] p-8 text-center"
          >
            <AlertCircle
              className="mx-auto text-[#fb7185]"
              size={25}
            />

            <p className="mt-3 text-sm text-[#e6e0e8]">
              {error || "Destination not found."}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {error && (
                <button
                  type="button"
                  onClick={() =>
                    setRetryVersion((previous) => previous + 1)
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-[#d1bcff] px-4 py-2 text-xs font-semibold text-[#24103F] transition hover:bg-[#e6d9ff]"
                >
                  <RefreshCw size={14} />
                  Try Again
                </button>
              )}

              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-[#cbc4d2] transition hover:bg-white/[0.06]"
              >
                <ArrowLeft size={14} />
                Back to Explore
              </Link>
            </div>
          </div>
        ) : (
          /* Destination content */
          <div className="space-y-5">
            <Link
              href="/explore"
              className="inline-flex w-fit items-center gap-2 text-xs font-medium text-[#a89cb5] transition-colors hover:text-white lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Explore
            </Link>

            <DestinationHero destination={destination} />

            <div className="grid items-start gap-5 lg:grid-cols-3">
              {/* Main content */}
              <div className="space-y-5 lg:col-span-2">
                <DestinationOverview destination={destination} />

                <DestinationAttractions />
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                <DestinationTravelContext destination={destination} />

                <DestinationCredits destination={destination} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}