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


export interface ApiNotification {
  id: string;
  user_id: string;

  type: string;
  title: string;
  message: string;

  action_url: string | null;

  is_read: boolean;

  created_at: string;
  read_at: string | null;
}

export interface ApiNotificationListResponse {
  items: ApiNotification[];

  total: number;
  unread_count: number;

  limit: number;
  offset: number;
}

export interface ApiNotificationUnreadCountResponse {
  unread_count: number;
}

export interface ApiNotificationMarkAllReadResponse {
  updated_count: number;
}