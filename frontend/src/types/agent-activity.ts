export type GlobalAgentRunStatus =
  | "running"
  | "completed"
  | "failed";

export type GlobalAgentEventStatus =
  | "completed"
  | "running"
  | "warning"
  | "failed"
  | "queued";

export type GlobalAgentEventType =
  | "request"
  | "flight"
  | "hotel"
  | "budget"
  | "places"
  | "weather"
  | "itinerary"
  | "validation"
  | "optimization";

export interface GlobalAgentEvent {
  id: string;

  title: string;

  description?: string;

  status: GlobalAgentEventStatus;

  type: GlobalAgentEventType;

  duration?: string;

  provider?: string;

  result?: string;
}

export interface GlobalAgentRun {
  id: string;

  tripId?: string;

  title: string;

  destination: string;

  image?: string;

  status: GlobalAgentRunStatus;

  createdAt: string;

  elapsedTime: string;

  completedSteps: number;

  totalSteps: number;

  events: GlobalAgentEvent[];
}