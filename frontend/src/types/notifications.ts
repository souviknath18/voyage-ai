export type NotificationType =
  | "agent"
  | "trip"
  | "price"
  | "weather"
  | "budget"
  | "system";

export type NotificationStatus =
  | "unread"
  | "read";

export interface VoyageNotification {
  id: string;

  type: NotificationType;

  status: NotificationStatus;

  category: string;

  tripId?: string;
  tripName?: string;

  title: string;

  description: string;

  time: string;

  actionLabel?: string;

  actionHref?: string;
}