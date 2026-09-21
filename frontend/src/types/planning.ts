export type PlanningStepStatus =
  | "completed"
  | "running"
  | "queued"
  | "warning"
  | "failed";

export type PlanningStepIcon =
  | "preferences"
  | "flight"
  | "hotel"
  | "budget"
  | "places"
  | "weather"
  | "cost"
  | "itinerary"
  | "final";

export interface PlanningStep {
  id: string;
  title: string;
  description?: string;
  status: PlanningStepStatus;
  icon: PlanningStepIcon;
  duration?: string;
  children?: PlanningStep[];
}

export interface PlanningTrip {
  id: string;
  origin: string;
  destination: string;

  startDate: string;
  endDate: string;

  travelers: number;

  currency: string;
  budget: number;

  pace: string;
  interests: string[];
}

export type PlanningRunStatus =
  | "queued"
  | "planning"
  | "completed"
  | "failed";

export interface PlanningRun {
  runId: string;
  trip: PlanningTrip;
  progress: number;
  status: PlanningRunStatus;
  steps: PlanningStep[];
}