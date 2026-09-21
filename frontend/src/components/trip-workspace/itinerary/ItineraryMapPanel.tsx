"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ExternalLink,
  Map,
  MapPin,
  Route,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Card,
} from "@/components/ui";

import {
  getTripMapPreview,
} from "@/lib/trips";

import type {
  ItineraryDayData,
} from "@/types/trip-workspace";


interface ItineraryMapPanelProps {
  tripId: string;

  day: ItineraryDayData;
}


export default function ItineraryMapPanel({
  tripId,
  day,
}: ItineraryMapPanelProps) {
  const router =
    useRouter();


  const [
    mapUrl,
    setMapUrl,
  ] = useState<
    string | null
  >(null);


  const [
    loading,
    setLoading,
  ] = useState(
    true,
  );


  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);


  useEffect(() => {
    let objectUrl:
      string | null = null;

    let cancelled =
      false;


    async function loadMapPreview() {
      try {
        setLoading(
          true,
        );

        setError(
          null,
        );

        setMapUrl(
          null,
        );


        const blob =
          await getTripMapPreview(
            tripId,
            day.dayNumber,
          );


        if (cancelled) {
          return;
        }


        objectUrl =
          URL.createObjectURL(
            blob,
          );


        setMapUrl(
          objectUrl,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }


        setError(
          error instanceof Error
            ? error.message
            : "Map preview unavailable",
        );
      } finally {
        if (!cancelled) {
          setLoading(
            false,
          );
        }
      }
    }


    loadMapPreview();


    return () => {
      cancelled =
        true;


      if (objectUrl) {
        URL.revokeObjectURL(
          objectUrl,
        );
      }
    };
  }, [
    tripId,
    day.dayNumber,
  ]);


  const verifiedActivities =
    day.activities.filter(
      (activity) =>
        activity.groundingType ===
          "verified_place" &&
        activity.placeId,
    );


  const openFullMap =
    () => {
      router.push(
        `/trips/${tripId}/map?day=${day.dayNumber}`,
      );
    };


  return (
    <Card className="sticky top-[76px] gap-0 overflow-hidden !p-0 !py-0">

      {/* ===================== */}
      {/* STATIC REAL MAP */}
      {/* ===================== */}

      <div className="relative aspect-[1/1] w-full shrink-0 overflow-hidden bg-[#d8d5cf] leading-none">

        {mapUrl && (
          <img
            src={mapUrl}
            alt={`Map preview for Day ${day.dayNumber}`}
            className="absolute inset-0 block h-full w-full object-cover"
          />
        )}


        {/*
         * Small VoyageAI tint.
         *
         * Keeps real roads/labels
         * visible while matching the
         * surrounding dark workspace.
         */}
        {mapUrl && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[#141218]/18" />

            <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-[#2E1065]/10 blur-[80px]" />

            <div className="pointer-events-none absolute -bottom-20 right-0 h-48 w-48 rounded-full bg-[#fb7185]/[0.05] blur-[80px]" />
          </>
        )}


        {/* Day label */}

        <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#211f24]/90 px-2.5 py-1.5 shadow-lg backdrop-blur-md">

          <Map
            size={
              12
            }
            className="text-[#d1bcff]"
          />


          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#cbc4d2]">
            Day{" "}
            {
              day.dayNumber
            }
          </span>

        </div>


        {/* Loading */}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#d8d5cf]">

            <div className="rounded-lg border border-white/10 bg-[#211f24]/90 px-4 py-2.5 text-xs font-medium text-[#cbc4d2] shadow-lg backdrop-blur-md">
              Loading map...
            </div>

          </div>
        )}


        {/* No map / provider error */}

        {!loading &&
          error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#211f24] to-[#141218]">

            <div className="max-w-[230px] px-5 text-center">

              <Map
                size={
                  26
                }
                className="mx-auto text-[#d1bcff]"
              />


              <p className="mt-3 text-sm font-medium text-[#e6e0e8]">
                Map preview unavailable
              </p>


              <p className="mt-1 text-[11px] leading-5 text-[#948e9c]">
                {error}
              </p>

            </div>

          </div>
        )}

      </div>


      {/* ===================== */}
      {/* DAY MAP INFORMATION */}
      {/* ===================== */}

      <div className="p-4">

        <div className="flex items-center justify-between gap-3">

          <div>

            <div className="flex items-center gap-2">

              <Route
                size={
                  15
                }
                className="text-[#fb7185]"
              />


              <h3 className="text-sm font-semibold text-[#e6e0e8]">
                Day{" "}
                {
                  day.dayNumber
                }{" "}
                Map
              </h3>

            </div>


            <p className="mt-1 text-[10px] text-[#948e9c]">
              {
                verifiedActivities.length
              }{" "}
              verified{" "}
              {
                verifiedActivities.length ===
                1
                  ? "place"
                  : "places"
              }{" "}
              mapped
            </p>

          </div>


          <button
            type="button"
            onClick={
              openFullMap
            }
            className="flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-[10px] font-medium text-[#cbc4d2] transition hover:border-[#fb7185]/30 hover:bg-[#fb7185]/10 hover:text-[#fb7185]"
          >

            <ExternalLink
              size={
                11
              }
            />


            Full map

          </button>

        </div>


        {/* ===================== */}
        {/* VERIFIED STOPS */}
        {/* ===================== */}

        <div className="mt-4 space-y-2">

          {verifiedActivities
            .slice(
              0,
              4,
            )
            .map(
              (
                activity,
                index,
              ) => (
                <div
                  key={
                    activity.id
                  }
                  className="flex min-w-0 items-center gap-2 text-xs text-[#948e9c]"
                >

                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#fb7185]/30 bg-[#fb7185]/10 text-[9px] font-semibold text-[#fb7185]">
                    {
                      index +
                      1
                    }
                  </span>


                  <MapPin
                    size={
                      11
                    }
                    className="shrink-0"
                  />


                  <span className="truncate">
                    {
                      activity.title
                    }
                  </span>

                </div>
              ),
            )}


          {verifiedActivities.length ===
            0 && (
            <p className="text-xs text-[#948e9c]">
              No verified places are
              mapped for this day.
            </p>
          )}

        </div>

      </div>

    </Card>
  );
}