"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import AgentActivityLog from "@/components/planning/AgentActivityLog";
import PlanningFailure from "./components/PlanningFailure";
import PlanningHeader from "@/components/planning/PlanningHeader";
import PlanningProgress from "@/components/planning/PlanningProgress";
import PlanningTripSummary from "@/components/planning/PlanningTripSummary";
import { PageLoader } from "@/components/ui";

import {
  getAgentRun,
  getAgentRunActivity,
  planTrip,
} from "@/lib/trips";

import type { AgentRun, AgentRunActivity, AgentStepActivity, ToolCallActivity } from "@/lib/trips";
import type { PlanningRun, PlanningStep, PlanningStepStatus } from "@/types/planning";


function mapStatus(
  status: string,
): PlanningStepStatus {
  if (status === "completed") {
    return "completed";
  }

  if (status === "running") {
    return "running";
  }

  if (status === "failed") {
    return "failed";
  }

  return "queued";
}

function formatDuration(
  startedAt: string | null,
  completedAt: string | null,
): string | undefined {
  if (!startedAt) {
    return undefined;
  }

  const start = new Date(startedAt).getTime();
  const end = completedAt
    ? new Date(completedAt).getTime()
    : Date.now();

  const seconds = Math.max(
    0,
    (end - start) / 1000,
  );

  if (seconds < 1) {
    return "< 1s";
  }

  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return `${minutes}m ${remainingSeconds}s`;
}

function mapAgentStep(
  step: AgentStepActivity,
): PlanningStep {
  const config: Record<
    string,
    {
      title: string;
      description: string;
      icon: PlanningStep["icon"];
    }
  > = {
    load_context: {
      title: "Understanding your preferences",
      description: "Analyzing your trip details, budget, travel pace and selected interests.",
      icon: "preferences",
    },

    research_trip: {
      title: "Researching your destination",
      description: "Gathering destination information needed to build your trip.",
      icon: "places",
    },

    generate_itinerary: {
      title: "Building your itinerary",
      description: "Creating a personalized day-by-day itinerary.",
      icon: "itinerary",
    },

    validate_itinerary: {
      title: "Validating your itinerary",
      description: "Checking the generated plan against your trip constraints.",
      icon: "final",
    },

    replan_itinerary: {
      title: "Optimizing your itinerary",
      description: "Improving the itinerary after validation found issues.",
      icon: "itinerary",
    },

    planning_failed: {
      title: "Planning failed",
      description: step.error_message ?? "VoyageAI could not complete the planning process.",
      icon: "final",
    },
  };

  const mapped = config[step.step_name] ?? {
    title: step.step_name.replaceAll("_", " "),
    description: "VoyageAI is processing this planning step.",
    icon: "final" as const,
  };

  return {
    id: step.id,
    title: mapped.title,
    description: mapped.description,
    status: mapStatus(step.status),
    icon: mapped.icon,
    duration: formatDuration(
      step.started_at,
      step.completed_at,
    ),
  };
}

function mapToolCall(
  tool: ToolCallActivity,
): PlanningStep {
  if (tool.tool_name === "get_weather") {
    return {
      id: tool.id,
      title: "Checking weather",
      description: "Retrieving weather information for your destination and travel dates.",
      status: mapStatus(tool.status),
      icon: "weather",
      duration: formatDuration(
        tool.started_at,
        tool.completed_at,
      ),
    };
  }

  if (tool.tool_name === "search_places") {
    return {
      id: tool.id,
      title: "Finding places",
      description: "Searching for relevant attractions, food and places for your itinerary.",
      status: mapStatus(tool.status),
      icon: "places",
      duration: formatDuration(
        tool.started_at,
        tool.completed_at,
      ),
    };
  }

  return {
    id: tool.id,
    title: tool.tool_name.replaceAll("_", " "),
    description: "VoyageAI is using a travel planning tool.",
    status: mapStatus(tool.status),
    icon: "final",
    duration: formatDuration(
      tool.started_at,
      tool.completed_at,
    ),
  };
}

const planningSequence = [
  "load_context",
  "research_trip",
  "generate_itinerary",
  "validate_itinerary",
] as const;

function createExpectedRunningStep(
  activity: AgentRunActivity,
  currentStep: string | null,
): PlanningStep | null {
  if (
    activity.status !== "running" &&
    activity.status !== "pending"
  ) {
    return null;
  }

  const existingStepNames = activity.steps.map(
    (step) => step.step_name,
  );

  const latestStep =
  activity.steps[
    activity.steps.length - 1
  ];

  const currentStepAlreadyRunning =
    latestStep?.step_name ===
      currentStep &&
    latestStep?.status === "running";

  if (
    currentStep &&
    !currentStepAlreadyRunning
  ) {
    const currentStepConfig: Record<
      string,
      {
        title: string;
        description: string;
        icon: PlanningStep["icon"];
      }
    > = {
      load_context: {
        title: "Understanding your preferences",
        description: "Analyzing your trip details, budget, travel pace and selected interests.",
        icon: "preferences",
      },

      research_trip: {
        title: "Researching your destination",
        description: "Gathering destination information needed to build your trip.",
        icon: "places",
      },

      generate_itinerary: {
        title: "Building your itinerary",
        description: "Creating a personalized day-by-day itinerary.",
        icon: "itinerary",
      },

      validate_itinerary: {
        title: "Validating your itinerary",
        description: "Checking the generated plan against your trip constraints.",
        icon: "final",
      },

      replan_itinerary: {
        title: "Optimizing your itinerary",
        description: "Improving the itinerary after validation found issues.",
        icon: "itinerary",
      },
    };

    const config =
      currentStepConfig[currentStep];

    if (config) {
      return {
        id: `expected-${currentStep}`,
        title: config.title,
        description: config.description,
        status: "running",
        icon: config.icon,
      };
    }
  }

  const planningSequence = [
    "load_context",
    "research_trip",
    "generate_itinerary",
    "validate_itinerary",
  ] as const;

  const nextStepName =
    planningSequence.find(
      (stepName) =>
        !existingStepNames.includes(
          stepName,
        ),
    );

  if (!nextStepName) {
    return null;
  }

  const nextStepConfig: Record<
    string,
    {
      title: string;
      description: string;
      icon: PlanningStep["icon"];
    }
  > = {
    load_context: {
      title: "Understanding your preferences",
      description: "Analyzing your trip details, budget, travel pace and selected interests.",
      icon: "preferences",
    },

    research_trip: {
      title: "Researching your destination",
      description: "Gathering destination information needed to build your trip.",
      icon: "places",
    },

    generate_itinerary: {
      title: "Building your itinerary",
      description: "Creating a personalized day-by-day itinerary.",
      icon: "itinerary",
    },

    validate_itinerary: {
      title: "Validating your itinerary",
      description: "Checking the generated plan against your trip constraints.",
      icon: "final",
    },
  };

  const config =
    nextStepConfig[nextStepName];

  return {
    id: `expected-${nextStepName}`,
    title: config.title,
    description: config.description,
    status: "running",
    icon: config.icon,
  };
}

function areAllActivityStepsCompleted(
  activity: AgentRunActivity,
): boolean {
  if (activity.steps.length === 0) {
    return false;
  }

  return activity.steps.every((step) => {
    const stepCompleted =
      step.status === "completed";

    const toolCallsCompleted =
      step.tool_calls.every(
        (tool) =>
          tool.status === "completed",
      );

    return (
      stepCompleted &&
      toolCallsCompleted
    );
  });
}

function buildActivitySteps(
  activity: AgentRunActivity | null,
  currentStep: string | null,
): PlanningStep[] {
  if (!activity) {
    return [];
  }

  const steps: PlanningStep[] =
    activity.steps.map((step) => {
      const planningStep =
        mapAgentStep(step);

      return {
        ...planningStep,
        children:
          step.tool_calls.map(
            mapToolCall,
          ),
      };
    });

  const hasRunningStep = steps.some(
    (step) =>
      step.status === "running" ||
      step.children?.some(
        (child) =>
          child.status === "running",
      ),
  );

  if (hasRunningStep) {
    return steps;
  }

  const expectedStep =
    createExpectedRunningStep(
      activity,
      currentStep,
    );

  if (expectedStep) {
    steps.push(expectedStep);

    return steps;
  }

  if (
    activity.status === "running" &&
    areAllActivityStepsCompleted(
      activity,
    )
  ) {
    steps.push({
      id: "finalizing-trip",
      title: "Finalizing your trip",
      description:
        "Saving your itinerary and preparing your trip workspace.",
      status: "running",
      icon: "final",
    });
  }

  return steps;
}

function countPlanningSteps(
  steps: PlanningStep[],
): {
  total: number;
  completed: number;
} {
  let total = 0;
  let completed = 0;

  for (const step of steps) {
    total += 1;

    if (step.status === "completed") {
      completed += 1;
    }

    if (step.children?.length) {
      const childCounts = countPlanningSteps(
        step.children,
      );

      total += childCounts.total;
      completed += childCounts.completed;
    }
  }

  return {
    total,
    completed,
  };
}

function buildPlanningRun(
  agentRun: AgentRun,
  activity: AgentRunActivity | null,
): PlanningRun {
  const snapshot = agentRun.input_snapshot as {
    trip?: {
      trip_id?: string;
      origin?: string;
      destination?: string;
      destination_name?: string | null;
      start_date?: string;
      end_date?: string;
      travelers?: number;
      budget?: number | null;
      currency?: string;
    };
    preferences?: {
      pace?: string;
      interests?: string[];
    };
  } | null;

  const trip = snapshot?.trip;
  const preferences = snapshot?.preferences;

  const currentStep = agentRun.current_step;

  const activitySteps =
    buildActivitySteps(
      activity,
      agentRun.current_step,
    );

  const {
    total: totalSteps,
    completed: completedSteps,
  } = countPlanningSteps(activitySteps);

  let progress = 5;

  if (agentRun.status === "completed") {
    progress = 100;
  } else if (totalSteps > 0) {
    progress = Math.min(
      Math.max(
        Math.round(
          (completedSteps / totalSteps) * 90,
        ),
        10,
      ),
      90,
    );
  }

  return {
    runId: agentRun.id,
    status:
      agentRun.status === "failed"
        ? "failed"
        : agentRun.status === "completed"
          ? "completed"
          : agentRun.status === "pending"
            ? "queued"
            : "planning",
    progress,
    trip: {
      id: trip?.trip_id ?? "",
      origin: trip?.origin?.split(",")[0].trim() ?? "Origin",
      destination: trip?.destination_name ?? trip?.destination?.split(",")[0].trim() ?? "Destination",
      startDate: trip?.start_date ?? "",
      endDate: trip?.end_date ?? "",
      travelers: trip?.travelers ?? 1,
      currency: trip?.currency ?? "INR",
      budget: trip?.budget ?? 0,
      pace: preferences?.pace ?? "balanced",
      interests: preferences?.interests ?? [],
    },
    steps: activitySteps,
  };
}

export default function PlanningPage() {
  const params = useParams<{ runId: string }>();
  const router = useRouter();

  const runId = params.runId;

  const [agentRun, setAgentRun] = useState<AgentRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<AgentRunActivity | null>(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadRun = async () => {
      try {
        const [run, runActivity] = await Promise.all([
          getAgentRun(runId),
          getAgentRunActivity(runId),
        ]);

        if (cancelled) {
          return;
        }

        setAgentRun(run);
        setActivity(runActivity);
        setError(null);

        if (run.status === "completed") {
          const snapshot = run.input_snapshot as {
            trip?: {
              trip_id?: string;
            };
          } | null;

          const tripId = snapshot?.trip?.trip_id;

          if (tripId) {
            window.setTimeout(() => {
              router.replace(`/trips/${tripId}`);
            }, 1200);
          }
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load planning status",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRun();

    const interval = window.setInterval(() => {
      loadRun();
    }, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [runId, router]);

  const handleRetry = async () => {
    if (!planningRun?.trip.id || retrying) {
      return;
    }

    try {
      setRetrying(true);
      setError(null);

      const newRun = await planTrip(
        planningRun.trip.id,
      );

      router.replace(
        `/planning/${newRun.id}`,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to restart trip planning",
      );

      setRetrying(false);
    }
  };

  const planningRun = useMemo(() => {
    if (!agentRun) {
      return null;
    }

    return buildPlanningRun(
      agentRun,
      activity,
    );
  }, [agentRun, activity]);

  if (loading && !planningRun) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (error && !planningRun) {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 text-sm text-red-400 md:px-6">
          {error}
        </div>
      </AppLayout>
    );
  }

  if (!planningRun) {
    return null;
  }

  if (planningRun.status === "failed") {
    return (
      <AppLayout>
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
          <PlanningFailure
            tripId={planningRun.trip.id}
            runId={planningRun.runId}
            origin={planningRun.trip.origin}
            destination={planningRun.trip.destination}
            startDate={planningRun.trip.startDate}
            endDate={planningRun.trip.endDate}
            travelers={planningRun.trip.travelers}
            currency={planningRun.trip.currency}
            budget={planningRun.trip.budget}
            errorMessage={agentRun?.error_message ?? null}
            steps={planningRun.steps}
            retrying={retrying}
            onRetryAction={handleRetry}
          />
        </div>
      </AppLayout>
    );
  }

  const running =
    planningRun.status === "planning" ||
    planningRun.status === "queued";

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-5">
          <PlanningHeader running={running} />

          <PlanningTripSummary trip={planningRun.trip} />

          <PlanningProgress progress={planningRun.progress} />

          <AgentActivityLog steps={planningRun.steps} />
        </div>
      </div>
    </AppLayout>
  );
}