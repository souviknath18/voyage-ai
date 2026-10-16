
import { apiRequest } from "@/lib/api";

import type {
  ApiNotification,
  ApiNotificationListResponse,
  ApiNotificationMarkAllReadResponse,
  ApiNotificationUnreadCountResponse,
} from "@/types/notifications";


export interface GetNotificationsParams {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}


export async function getNotifications(
  params: GetNotificationsParams = {},
): Promise<ApiNotificationListResponse> {
  const {
    limit = 20,
    offset = 0,
    unreadOnly = false,
  } = params;

  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    unread_only: String(unreadOnly),
  });

  return apiRequest<ApiNotificationListResponse>(
    `/notifications?${query.toString()}`,
  );
}


export async function getUnreadNotificationCount(): Promise<ApiNotificationUnreadCountResponse> {
  return apiRequest<ApiNotificationUnreadCountResponse>(
    "/notifications/unread-count",
  );
}


export async function markNotificationRead(
  notificationId: string,
): Promise<ApiNotification> {
  return apiRequest<ApiNotification>(
    `/notifications/${encodeURIComponent(notificationId)}/read`,
    {
      method: "PATCH",
    },
  );
}


export async function markAllNotificationsRead(): Promise<ApiNotificationMarkAllReadResponse> {
  return apiRequest<ApiNotificationMarkAllReadResponse>(
    "/notifications/read-all",
    {
      method: "PATCH",
    },
  );
}