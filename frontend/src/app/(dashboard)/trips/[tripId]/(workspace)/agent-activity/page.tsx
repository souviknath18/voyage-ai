import TripAIActivity from "@/components/trip-workspace/activity/TripAIActivity";

import { mockTrip } from "@/data/mock-trip";

export default function TripAgentActivityPage() {
  const trip =
    mockTrip;

  return (
    <TripAIActivity
      run={
        trip.agentRun
      }
    />
  );
}