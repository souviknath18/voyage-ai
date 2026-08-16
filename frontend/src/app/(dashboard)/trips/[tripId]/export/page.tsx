"use client";

import {
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import ExportTrip from "@/components/trip-workspace/export/ExportTrip";

import {
  mockTrip,
} from "@/data/mock-trip";

export default function ExportTripPage() {
  const router =
    useRouter();

  return (
    <AppLayout>
      <div className="w-full px-4 pb-4 pt-3 md:px-6">
        <ExportTrip
          trip={mockTrip}
          onBackAction={() =>
            router.back()
          }
        />
      </div>
    </AppLayout>
  );
}