export type AssistantMessageRole =
  | "user"
  | "assistant";

export interface AssistantMessage {
  id: string;

  role: AssistantMessageRole;

  content: string;

  time?: string;
}

export type AssistantStepStatus =
  | "completed"
  | "running"
  | "queued";

export interface AssistantStep {
  id: string;

  title: string;

  status: AssistantStepStatus;
}

export interface AssistantProposalOption {
  title: string;

  subtitle: string;

  image?: string;

  details: string[];

  amount?: string;

  label?: string;
}

export interface AssistantProposalData {
  id: string;

  title: string;

  description: string;

  current: AssistantProposalOption;

  proposed: AssistantProposalOption;

  impact: string;
}

export type TripAssistantAction =
  | "answer"
  | "change_requested";

export type TripChangeScope =
  | "trip"
  | "day"
  | "activity";

export type TripChangeCategory =
  | "budget"
  | "food"
  | "transport"
  | "activity"
  | "schedule"
  | "general";

export interface TripChangeProposal {
  title: string;
  summary: string;
  scope: TripChangeScope;
  day_number: number | null;
  category: TripChangeCategory;
  instructions: string;
}

export interface TripAssistantResponse {
  message: string;
  action: TripAssistantAction;
  proposal: TripChangeProposal | null;
}