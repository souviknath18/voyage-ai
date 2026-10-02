// import TripAIActivity from "@/components/trip-workspace/activity/TripAIActivity";

// import { mockTrip } from "@/data/mock-trip";

// export default function TripAgentActivityPage() {
//   const trip =
//     mockTrip;

//   return (
//     <TripAIActivity
//       run={
//         trip.agentRun
//       }
//     />
//   );
// }




"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import TripAIActivity from "@/components/trip-workspace/activity/TripAIActivity";

import {
  getAgentRunActivity,
  getTripItinerary,
} from "@/lib/trips";

import {
  mapAgentActivityToRun,
} from "@/lib/agent-activity-mappers";

import type {
  AgentRunData,
} from "@/types/trip-workspace";


export default function TripAgentActivityPage() {
  const params =
    useParams<{
      tripId: string;
    }>();

  const tripId =
    params.tripId;

  const [
    run,
    setRun,
  ] = useState<AgentRunData | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );


  useEffect(() => {
    if (!tripId) {
      return;
    }

    let cancelled = false;


    const loadActivity =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const itinerary =
            await getTripItinerary(
              tripId,
            );

          const activity =
            await getAgentRunActivity(
              itinerary.agent_run_id,
            );

          if (cancelled) {
            return;
          }

          setRun(
            mapAgentActivityToRun(
              activity,
            ),
          );
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to load agent activity:",
            error,
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load agent activity",
          );
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };


    loadActivity();


    return () => {
      cancelled = true;
    };
  }, [tripId]);


  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-[#948e9c]">
        Loading AI activity...
      </div>
    );
  }


  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }


  if (!run) {
    return (
      <div className="py-10 text-center text-sm text-[#948e9c]">
        No AI activity found for this trip.
      </div>
    );
  }


  return (
    <TripAIActivity
      run={run}
    />
  );
}