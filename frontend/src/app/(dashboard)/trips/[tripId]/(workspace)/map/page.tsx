"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useSearchParams,
} from "next/navigation";

import TripMap from "@/components/trip-workspace/map/TripMap";

import {
  mapTripToMapDays,
} from "@/lib/map-mappers";

import {
  getTrip,
  getTripItinerary,
  getTripPlaces,
} from "@/lib/trips";

import type {
  TripMapDay,
} from "@/types/trip-workspace";


export default function TripMapPage() {
  const params =
    useParams();

  const searchParams =
    useSearchParams();


  const tripId =
    params.tripId as string;


  /*
   * Example:
   *
   * /map?day=2
   *
   * becomes:
   *
   * requestedDay = 2
   */
  const dayParam =
    searchParams.get(
      "day",
    );


  const parsedDay =
    dayParam
      ? Number(
          dayParam,
        )
      : undefined;


  const requestedDay =
    parsedDay &&
    Number.isInteger(
      parsedDay,
    ) &&
    parsedDay > 0
      ? parsedDay
      : undefined;


  const [
    days,
    setDays,
  ] =
    useState<
      TripMapDay[]
    >([]);


  const [
    currency,
    setCurrency,
  ] =
    useState(
      "INR",
    );


  const [
    destination,
    setDestination,
  ] =
    useState(
      "",
    );


  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );


  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);


  useEffect(() => {
    async function loadMap() {
      try {
        setLoading(
          true,
        );

        setError(
          null,
        );


        const [
          trip,
          itinerary,
          places,
        ] =
          await Promise.all([
            getTrip(
              tripId,
            ),

            getTripItinerary(
              tripId,
            ),

            getTripPlaces(
              tripId,
            ),
          ]);


        const mappedDays =
          mapTripToMapDays(
            itinerary,
            places,
          );


        setDays(
          mappedDays,
        );


        setCurrency(
          trip.currency,
        );


        setDestination(
          trip.destination,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load map",
        );
      } finally {
        setLoading(
          false,
        );
      }
    }


    if (tripId) {
      loadMap();
    }
  }, [
    tripId,
  ]);


  if (loading) {
    return (
      <div className="py-10 text-sm text-[#948e9c]">
        Loading trip map...
      </div>
    );
  }


  if (error) {
    return (
      <div className="py-10 text-sm text-red-400">
        {error}
      </div>
    );
  }


  return (
    <TripMap
      days={
        days
      }
      currency={
        currency
      }
      destination={
        destination
      }
      initialDay={
        requestedDay
      }
    />
  );
}