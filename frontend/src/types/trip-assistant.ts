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