"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import TripAIOverview from "@/components/trip-workspace/TripAIOverview";
import TripBudgetOverview from "@/components/trip-workspace/TripBudgetOverview";
import TripFlightCard from "@/components/trip-workspace/TripFlightCard";
import TripHighlights from "@/components/trip-workspace/TripHighlights";
import TripHotelCard from "@/components/trip-workspace/TripHotelCard";
import TripOptimizationActions from "@/components/trip-workspace/TripOptimizationActions";
import TripWarningCard from "@/components/trip-workspace/TripWarningCard";
import TripWeatherCard from "@/components/trip-workspace/TripWeatherCard";

import {
  getSelectedTripFlight,
  getTrip,
  getTripItinerary,
  getTripWeather,
  getSelectedTripHotel,
  getTripBudget,
  getRecommendedTripHotel,
  type SelectedFlightResponse,
  type Trip,
  type TripItinerary,
  type TripWeather,
  type SelectedHotelResponse,
  type TripBudget,
  type RecommendedHotelResponse,
} from "@/lib/trips";

import {
  mapSelectedFlightToTripFlights,
} from "@/lib/flight-mappers";

import {
  mapSelectedHotelToOption,
} from "@/lib/hotel-mappers";

import type {
  TripHotel,
  TripWeather as TripWeatherCardData,
} from "@/types/trip-workspace";


export default function TripOverviewPage() {
  const router =
    useRouter();

  const params =
    useParams<{
      tripId: string;
    }>();

  const [
    trip,
    setTrip,
  ] = useState<Trip | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    itinerary,
    setItinerary,
  ] = useState<TripItinerary | null>(
    null,
  );

  const [
    weather,
    setWeather,
  ] = useState<TripWeather | null>(
    null,
  );

  const [
    selectedFlight,
    setSelectedFlight,
  ] = useState<SelectedFlightResponse | null>(
    null,
  );

  const [selectedHotel, setSelectedHotel] =
    useState<SelectedHotelResponse | null>(null);

  const [recommendedHotel, setRecommendedHotel] =
    useState<RecommendedHotelResponse | null>(null);

  const [budget, setBudget] = useState<TripBudget | null>(null);

  useEffect(() => {
    if (!params.tripId) {
      return;
    }

    let cancelled = false;

    const loadTrip = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load the essential Overview data first.
        const [
          tripData,
          itineraryData,
          selectedFlightData,
          selectedHotelData,
          recommendedHotelData,
          budgetData,
        ] = await Promise.all([
          getTrip(params.tripId),
          getTripItinerary(params.tripId),
          getSelectedTripFlight(params.tripId),
          getSelectedTripHotel(params.tripId),
          getRecommendedTripHotel(params.tripId).catch((error) => {
            console.warn("Hotel recommendation unavailable:", error);
            return null;
          }),
          getTripBudget(params.tripId),
        ]);

        if (cancelled) {
          return;
        }

        setTrip(tripData);
        setItinerary(
          itineraryData,
        );
        setSelectedFlight(
          selectedFlightData,
        );
        setSelectedHotel(selectedHotelData);
        setRecommendedHotel(recommendedHotelData);
        setBudget(budgetData);

        // The Overview can now render.
        setLoading(false);

        // Weather is optional and should never block the page.
        try {
          const weatherData =
            await getTripWeather(
              params.tripId,
            );

          if (cancelled) {
            return;
          }

          setWeather(
            weatherData,
          );
        } catch (weatherError) {
          console.warn(
            "Weather unavailable:",
            weatherError,
          );

          if (!cancelled) {
            setWeather(null);
          }
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load trip:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load trip",
        );

        setLoading(false);
      }
    };

    loadTrip();

    return () => {
      cancelled = true;
    };
  }, [params.tripId]);


  const handleResolveConflict = () => {
    if (!trip) {
      return;
    }

    const conflict =
      itinerary?.validation_warnings?.[0];

    if (!conflict) {
      return;
    }

    const message = [
      "Change my itinerary schedule to resolve this scheduling conflict:",
      conflict,
      "Move the conflicting activities to different, practical times.",
      "Keep the same places and preserve unaffected activities.",
      "Generate a structured schedule change proposal for my approval.",
      "Do not apply any changes until I explicitly approve the proposal.",
    ].join("\n\n");

    const query = new URLSearchParams({
      request: message,
    });

    router.push(
      `/trips/${trip.trip_id}/assistant?${query.toString()}`
    );
  };


  const handleOptimizationPreset = (
    type: string,
  ) => {
    console.log(
      "Optimization:",
      type,
    );

    if (!trip) {
      return;
    }

    router.push(
      `/trips/${trip.trip_id}/optimize`,
    );
  };

  const overviewFlights =
    selectedFlight
      ? mapSelectedFlightToTripFlights(
          selectedFlight,
        )
      : [];

  const overviewHotel: TripHotel | null = (() => {
    if (selectedHotel) {
      const hotel = mapSelectedHotelToOption(selectedHotel);

      return {
        id: selectedHotel.hotel_id,
        name: hotel.name,
        room: hotel.room,
        address: hotel.address ?? hotel.location,
        image: hotel.image,
        rating: hotel.rating,
        pricePerNight: hotel.pricePerNight,
        nights: hotel.nights,
      };
    }

    if (recommendedHotel) {
      const offer = recommendedHotel.recommended_hotel;

      return {
        id: offer.hotel_id,
        name: offer.name,
        room: offer.room.name,
        address: offer.address ?? "",
        image: offer.image_url ?? "",
        rating: offer.rating ?? 0,
        pricePerNight: Number(offer.converted_price_per_night),
        nights: offer.nights,
      };
    }

    return null;
  })();


  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading trip...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="font-semibold">
          Unable to load trip
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error}
        </p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="p-6">
        Trip not found.
      </div>
    );
  }

  const estimatedCost = budget
    ? Number(budget.estimated_cost)
    : 0;

  const totalBudget = budget?.total_budget
    ? Number(budget.total_budget)
    : Number(trip.budget ?? 0);

  const categoryLabels: Record<string, string> = {
    food: "Food",
    transport: "Transport",
    activity: "Activities",
    shopping: "Shopping",
    accommodation: "Accommodation",
    flight: "Flights",
    other: "Other",
  };

  const budgetBreakdown = budget?.categories
    .filter((category) => Number(category.estimated_cost) > 0)
    .map((category) => ({
      label: categoryLabels[category.category] ?? category.category,
      amount: Number(category.estimated_cost),
    })) ?? [];

  // Build highlights from verified itinerary places.
  const tripHighlights = Array.from(
    new Set(
      (itinerary?.days ?? [])
        .flatMap((day) => day.activities)
        .filter(
          (activity) =>
            activity.activity_type === "verified_place" &&
            activity.place_id !== null,
        )
        .map((activity) => {
          const location = activity.location?.trim();

          return location
            ? location.split(",")[0].trim()
            : activity.title.trim();
        })
        .filter((name) => name.length > 0),
    ),
  ).slice(0, 6);

  const today =
    new Date().toISOString().split("T")[0];

  const currentForecast =
    weather?.forecast.find(
      (day) => day.date === today,
    ) ??
    weather?.forecast[0] ??
    null;

  const weatherCardData:
    TripWeatherCardData | null =
      currentForecast
        ? {
            temperature: Math.round(
              currentForecast.temperature_max ??
                currentForecast.temperature_min ??
                0,
            ),
            condition:
              currentForecast.weather_description,
            note:
              currentForecast
                .precipitation_probability !== null
                ? `${currentForecast.precipitation_probability}% chance of precipitation`
                : "Precipitation data unavailable",
          }
        : null;


  return (
    <div className="space-y-5">

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

        <div className="lg:col-span-8">
          <TripAIOverview
            summary={
              itinerary?.summary ??
              "No AI trip summary available."
            }
          />
        </div>

        <div className="lg:col-span-4">
          <TripWarningCard
            hasConflict={
              (itinerary?.validation_warnings?.length ?? 0) > 0
            }
            title={
              (itinerary?.validation_warnings?.length ?? 0) > 0
                ? "Possible itinerary conflict"
                : "No scheduling conflicts detected"
            }
            description={
              itinerary?.validation_warnings?.[0] ??
              "No activities are scheduled at the same start time."
            }
            onResolveAction={
              (itinerary?.validation_warnings?.length ?? 0) > 0
                ? handleResolveConflict
                : undefined
            }
          />
        </div>
      </div>


      {/* Travel Details */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">

        <div className="lg:col-span-5">
          <TripFlightCard
            flights={
              overviewFlights
            }
            onCompareAction={() =>
              router.push(
                `/trips/${trip.trip_id}/flights`,
              )
            }
          />
        </div>


        <div className="lg:col-span-5">
          {overviewHotel ? (
            <TripHotelCard
              hotel={overviewHotel}
              isRecommended={!selectedHotel && !!recommendedHotel}
              onViewDetailsAction={() =>
                router.push(`/trips/${trip.trip_id}/hotels`)
              }
              onCompareAction={() =>
                router.push(`/trips/${trip.trip_id}/hotels`)
              }
            />
          ) : (
            <div className="flex h-full flex-col justify-center rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-base font-semibold text-[#e6e0e8]">
                Accommodation
              </h2>

              <p className="mt-2 text-sm text-[#948e9c]">
                No hotel selected for this trip yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(`/trips/${trip.trip_id}/hotels`)
                }
                className="mt-4 self-start text-sm font-medium text-[#d1bcff] hover:text-[#fb7185]"
              >
                Browse Hotels →
              </button>
            </div>
          )}
        </div>


        <div className="lg:col-span-2">
          <TripWeatherCard
            weather={weatherCardData}
          />
        </div>

      </div>


      {/* Budget + Highlights */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        <TripBudgetOverview
          currency={budget?.currency ?? trip.currency}
          totalBudget={totalBudget}
          estimatedCost={estimatedCost}
          items={budgetBreakdown}
        />

        <TripHighlights highlights={tripHighlights} />

      </div>


      {/* Optimization */}

      <TripOptimizationActions
        onOptimizeAction={
          handleOptimizationPreset
        }
      />

    </div>
  );
}