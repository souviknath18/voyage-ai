import AppLayout from "@/components/layout/AppLayout";

import TripWorkspaceHeader from "@/components/trip-workspace/TripWorkspaceHeader";
import TripWorkspaceTabs from "@/components/trip-workspace/TripWorkspaceTabs";
import TripAssistantLauncher from "@/components/trip-workspace/assistant/TripAssistantLauncher";

import {
  mockTrip,
} from "@/data/mock-trip";

interface TripWorkspaceLayoutProps {
  children: React.ReactNode;

  params: Promise<{
    tripId: string;
  }>;
}

export default async function TripWorkspaceLayout({
  children,
  params,
}: TripWorkspaceLayoutProps) {
  const {
    tripId,
  } = await params;

  /*
   * Later:
   *
   * const trip =
   *   await getTrip(tripId);
   */

  const trip =
    mockTrip;

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-5 pt-2.5 sm:pt-3">
          {/* Trip Hero */}
          <TripWorkspaceHeader
            trip={trip}
          />

          {/* Workspace Tabs */}
          <TripWorkspaceTabs
            tripId={tripId}
          />

          {/* Overview / Itinerary / Budget / Places / Map / Activity */}
          {children}

          <TripAssistantLauncher
            tripId={tripId}
            destination={
              trip.destination
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}