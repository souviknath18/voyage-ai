"use client";

import {
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import OptimizeTrip from "@/components/trip-workspace/optimize/OptimizeTrip";

import {
  mockTrip,
} from "@/data/mock-trip";

export default function OptimizeTripPage() {
  const router =
    useRouter();

  const trip =
    mockTrip;

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="pt-2.5 sm:pt-3">
          <OptimizeTrip
            trip={trip}
            onCloseAction={() =>
              router.push(
                `/trips/${trip.id}`,
              )
            }
            onStartOptimizationAction={(
              presets,
              customRequest,
            ) => {
              console.log(
                "Presets:",
                presets,
              );

              console.log(
                "Custom:",
                customRequest,
              );

              /*
               * Later:
               *
               * POST optimization
               *
               * router.push(
               *   `/planning/${runId}`
               * );
               */
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
}