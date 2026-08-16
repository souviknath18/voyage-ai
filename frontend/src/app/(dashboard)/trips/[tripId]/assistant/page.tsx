"use client";

import {
  useParams,
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import TripAssistant from "@/components/trip-workspace/assistant/TripAssistant";

import {
  mockTrip,
} from "@/data/mock-trip";

export default function TripAssistantPage() {
  const router =
    useRouter();

  const params =
    useParams<{
      tripId: string;
    }>();

  return (
    <AppLayout>
      {/*
       * AppLayout already has:
       *
       * main -> pt-14
       *
       * 3.5rem = 56px navbar height.
       *
       * Therefore this container takes
       * exactly the remaining viewport.
       */}
      <div className="h-[calc(100dvh-3.5rem)] w-full overflow-hidden px-4 py-3 md:px-6">
        <TripAssistant
          trip={mockTrip}
          onBackAction={() =>
            router.push(
              `/trips/${params.tripId}`,
            )
          }
        />
      </div>
    </AppLayout>
  );
}