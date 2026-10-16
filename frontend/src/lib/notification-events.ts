export const NOTIFICATIONS_UPDATED_EVENT =
  "aix-voyage:notifications-updated";

export function notifyNotificationsUpdated(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new Event(NOTIFICATIONS_UPDATED_EVENT),
  );
}

export function subscribeToNotificationsUpdated(
  callback: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(
    NOTIFICATIONS_UPDATED_EVENT,
    callback,
  );

  return () => {
    window.removeEventListener(
      NOTIFICATIONS_UPDATED_EVENT,
      callback,
    );
  };
}