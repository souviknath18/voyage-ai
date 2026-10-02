import type {
  AgentRunActivity,
  AgentStepActivity,
  ToolCallActivity,
} from "@/lib/trips";

import type {
  AgentActivityEvent,
  AgentActivityStatus,
  AgentActivityType,
  AgentRunData,
} from "@/types/trip-workspace";


function mapStatus(
  status: string,
): AgentActivityStatus {
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

  const start =
    new Date(startedAt).getTime();

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

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    Math.round(seconds % 60);

  return `${minutes}m ${remainingSeconds}s`;
}


function getStepConfig(
  stepName: string,
): {
  title: string;
  description: string;
  type: AgentActivityType;
} {
  const config: Record<
    string,
    {
      title: string;
      description: string;
      type: AgentActivityType;
    }
  > = {
    load_context: {
      title: "Understanding your trip",
      description:
        "Loading your trip details, preferences and planning constraints.",
      type: "request",
    },

    research_trip: {
      title: "Researching your destination",
      description:
        "Gathering destination, places and weather information.",
      type: "places",
    },

    generate_itinerary: {
      title: "Building your itinerary",
      description:
        "Creating a personalized day-by-day travel plan.",
      type: "itinerary",
    },

    validate_itinerary: {
      title: "Validating your itinerary",
      description:
        "Checking the generated plan against budget and itinerary constraints.",
      type: "validation",
    },

    replan_itinerary: {
      title: "Optimizing your itinerary",
      description:
        "Adjusting the itinerary after validation found issues.",
      type: "optimization",
    },
  };

  return (
    config[stepName] ?? {
      title: stepName.replaceAll(
        "_",
        " ",
      ),
      description:
        "VoyageAI processed this planning step.",
      type: "request",
    }
  );
}


function mapStep(
  step: AgentStepActivity,
): AgentActivityEvent {
  const config =
    getStepConfig(step.step_name);

  return {
    id: step.id,

    title: config.title,

    description:
      step.error_message ??
      config.description,

    status: mapStatus(
      step.status,
    ),

    type: config.type,

    duration: formatDuration(
      step.started_at,
      step.completed_at,
    ),

    children:
      step.tool_calls.map(
        mapToolCall,
      ),
  };
}


function mapToolCall(
  tool: ToolCallActivity,
): AgentActivityEvent {
  const configs: Record<
    string,
    {
      title: string;
      description: string;
      type: AgentActivityType;
    }
  > = {
    resolve_location: {
      title: "Resolving destination",
      description:
        "Finding destination location information.",
      type: "places",
    },

    search_places: {
      title: "Finding places",
      description:
        "Searching for attractions, food and relevant places.",
      type: "places",
    },

    get_weather: {
      title: "Checking weather",
      description:
        "Retrieving weather information for the trip.",
      type: "weather",
    },
  };

  const config =
    configs[tool.tool_name] ?? {
      title: tool.tool_name.replaceAll(
        "_",
        " ",
      ),

      description:
        "VoyageAI used a travel planning tool.",

      type: "request" as AgentActivityType,
    };

  return {
    id: tool.id,

    title: config.title,

    description:
      tool.error_message ??
      config.description,

    status: mapStatus(
      tool.status,
    ),

    type: config.type,

    duration: formatDuration(
      tool.started_at,
      tool.completed_at,
    ),
  };
}


export function mapAgentActivityToRun(
  activity: AgentRunActivity,
): AgentRunData {
  const events: AgentActivityEvent[] =
    activity.steps.map(
      mapStep,
    );

  const completedSteps =
    events.filter(
      (event) =>
        event.status === "completed",
    ).length;

  return {
    id: activity.id,

    title: "VoyageAI Planning Run",

    status:
      activity.status === "failed"
        ? "failed"
        : activity.status ===
            "completed"
          ? "completed"
          : "running",

    startedAt:
      activity.started_at ?? "",

    elapsedTime:
      formatDuration(
        activity.started_at,
        activity.completed_at,
      ) ?? "—",

    completedSteps,

    totalSteps: events.length,

    events,
  };
}