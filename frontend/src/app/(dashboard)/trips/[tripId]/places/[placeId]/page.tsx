"use client";

import {
  useParams,
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import PlaceDetails from "@/components/trip-workspace/place-details/PlaceDetails";

import {
  mockTrip,
} from "@/data/mock-trip";

export default function PlaceDetailsPage() {
  const router =
    useRouter();

  const params =
    useParams<{
      tripId: string;
      placeId: string;
    }>();

  const place =
    mockTrip.placeDetails.find(
      (item) =>
        item.id ===
        params.placeId,
    );

  if (!place) {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
          <div className="pt-2.5 sm:pt-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-16 text-center">
              <h1 className="text-base font-semibold text-[#e6e0e8]">
                Place not found
              </h1>

              <p className="mt-2 text-sm text-[#948e9c]">
                This place is no longer available.
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="pt-2.5 sm:pt-3">
          <PlaceDetails
            place={place}
            onBackAction={() =>
              router.push(
                `/trips/${params.tripId}/places`,
              )
            }
            onSaveAction={() =>
              console.log(
                "Save place",
              )
            }
            onAddAction={() =>
              console.log(
                "Add place",
              )
            }
            onNearbySelectAction={(
              nearbyPlaceId,
            ) =>
              router.push(
                `/trips/${params.tripId}/places/${nearbyPlaceId}`,
              )
            }
            onAskAIAction={() =>
              console.log(
                "Ask VoyageAI",
              )
            }
            onOptimizeAction={() =>
              router.push(
                `/trips/${params.tripId}/optimize`,
              )
            }
            onOpenMapAction={() =>
              router.push(
                `/trips/${params.tripId}/map`,
              )
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}