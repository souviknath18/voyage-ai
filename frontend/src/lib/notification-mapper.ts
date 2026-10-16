
import type {
  ApiNotification,
  NotificationType,
  VoyageNotification,
} from "@/types/notifications";

function getNotificationType(
  eventType: string,
): NotificationType {
  switch (eventType) {
    case "itinerary_ready":
      return "agent";

    case "trip_update":
      return "trip";

    case "price_change":
      return "price";

    case "weather_alert":
      return "weather";

    case "budget_update":
      return "budget";

    default:
      return "system";
  }
}

function getNotificationCategory(
  type: NotificationType,
): string {
  switch (type) {
    case "agent":
      return "AI Agent Update";

    case "trip":
      return "Trip Update";

    case "price":
      return "Price Change";

    case "weather":
      return "Weather Info";

    case "budget":
      return "Budget Update";

    default:
      return "System Update";
  }
}

function getNotificationTime(
  createdAt: string,
): string {
  const date = new Date(createdAt);
  const timestamp = date.getTime();

  if (!Number.isFinite(timestamp)) {
    return "Unknown time";
  }

  const difference = Math.max(
    0,
    Date.now() - timestamp,
  );

  const minutes = Math.floor(
    difference / 60_000,
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTripId(
  actionUrl: string | null,
): string | undefined {
  if (!actionUrl) {
    return undefined;
  }

  const match = actionUrl.match(
    /^\/trips\/([^/?#]+)/,
  );

  return match
    ? decodeURIComponent(match[1])
    : undefined;
}

export function mapApiNotification(
  notification: ApiNotification,
): VoyageNotification {
  const type = getNotificationType(
    notification.type,
  );

  const actionHref =
    notification.action_url?.startsWith("/") &&
    !notification.action_url.startsWith("//")
      ? notification.action_url
      : undefined;

  return {
    id: notification.id,

    type,

    status: notification.is_read
      ? "read"
      : "unread",

    category: getNotificationCategory(type),

    tripId: getTripId(actionHref ?? null),

    title: notification.title,

    description: notification.message,

    time: getNotificationTime(
      notification.created_at,
    ),

    actionLabel: actionHref
      ? "View Trip"
      : undefined,

    actionHref,
  };
}

export function mapApiNotifications(
  notifications: ApiNotification[],
): VoyageNotification[] {
  return notifications.map(mapApiNotification);
}