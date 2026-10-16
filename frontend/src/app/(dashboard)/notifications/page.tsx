"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import NotificationsEmptyState from "@/components/notifications/NotificationsEmptyState";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";
import NotificationsSection from "@/components/notifications/NotificationsSection";
import NotificationsPageSkeleton from "@/components/notifications/NotificationsPageSkeleton";
import ErrorState from "@/components/ui/ErrorState";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications";

import {
  mapApiNotifications,
} from "@/lib/notification-mapper";

import {
  notifyNotificationsUpdated,
} from "@/lib/notification-events";

import type {
  VoyageNotification,
} from "@/types/notifications";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<VoyageNotification[]>([]);

  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const pendingReadIds = useRef(new Set<string>());
  const markingAllRead = useRef(false);
  
  const loadRequestId = useRef(0);

  const retryController = useRef<AbortController | null>(null);
  
  
  const loadNotifications = useCallback(async () => {
    retryController.current?.abort();

    const controller = new AbortController();
    retryController.current = controller;

    const requestId = ++loadRequestId.current;

    setLoading(true);
    setLoadError(false);

    const maxAttempts = 3;

    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (controller.signal.aborted) {
          return;
        }

        try {
          const response = await getNotifications({
            limit: 100,
            offset: 0,
          });

          if (
            controller.signal.aborted ||
            requestId !== loadRequestId.current
          ) {
            return;
          }

          setNotifications(
            mapApiNotifications(response.items),
          );

          setLoadError(false);
          return;
        } catch (error) {
          if (
            controller.signal.aborted ||
            requestId !== loadRequestId.current
          ) {
            return;
          }

          const status =
            typeof error === "object" &&
            error !== null &&
            "status" in error &&
            typeof error.status === "number"
              ? error.status
              : undefined;

          const shouldRetry =
            status === undefined ||
            status === 408 ||
            status === 429 ||
            status >= 500;

          if (!shouldRetry || attempt === maxAttempts) {
            console.error(
              "Failed to load notifications:",
              error,
            );

            setLoadError(true);
            return;
          }

          const delay = attempt * 1000;

          await new Promise<void>((resolve) => {
            const timeout = setTimeout(resolve, delay);

            controller.signal.addEventListener(
              "abort",
              () => {
                clearTimeout(timeout);
                resolve();
              },
              { once: true },
            );
          });
        }
      }
    } finally {
      if (
        !controller.signal.aborted &&
        requestId === loadRequestId.current
      ) {
        setLoading(false);
      }
    }
  }, []);


  useEffect(() => {
    void loadNotifications();

    return () => {
      retryController.current?.abort();
      loadRequestId.current++;
    };
  }, [loadNotifications]);

  const filteredNotifications = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }

    return notifications.filter(
      (notification) => notification.type === filter,
    );
  }, [notifications, filter]);

  const unreadNotifications =
    filteredNotifications.filter(
      (notification) => notification.status === "unread",
    );

  const earlierNotifications =
    filteredNotifications.filter(
      (notification) => notification.status === "read",
    );

  const unreadCount = notifications.filter(
    (notification) => notification.status === "unread",
  ).length;
  
  const handleRead = async (id: string) => {
    const notification = notifications.find(
      (item) => item.id === id,
    );

    if (
      !notification ||
      notification.status === "read" ||
      pendingReadIds.current.has(id) ||
      markingAllRead.current
    ) {
      return;
    }

    pendingReadIds.current.add(id);

    try {
      await markNotificationRead(id);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === id
            ? { ...item, status: "read" }
            : item,
        ),
      );

      notifyNotificationsUpdated();
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error,
      );
    } finally {
      pendingReadIds.current.delete(id);
    }
  };

  const handleMarkAllRead = async () => {
    if (
      markingAllRead.current ||
      pendingReadIds.current.size > 0 ||
      unreadCount === 0
    ) {
      return;
    }

    markingAllRead.current = true;

    try {
      await markAllNotificationsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          status: "read",
        })),
      );

      notifyNotificationsUpdated();
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error,
      );
    } finally {
      markingAllRead.current = false;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <NotificationsPageSkeleton />
      </AppLayout>
    );
  }

  
  if (loadError) {
    return (
      <AppLayout>
        <ErrorState
          fullScreen={false}
          title="Unable to load notifications"
          description="We couldn't fetch your notifications right now. Please try again."
          recoveryMessage="Your notifications are still available. Retry to reconnect and load the latest updates."
          retrying={loading}
          onRetry={() => {
            void loadNotifications();
          }}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-6">
          <NotificationsHeader
            filter={filter}
            unreadCount={
              unreadCount
            }
            onFilterChangeAction={
              setFilter
            }
            onMarkAllReadAction={
              handleMarkAllRead
            }
            onSettingsAction={() =>
              router.push(
                "/settings#notifications",
              )
            }
          />

          {filteredNotifications.length ===
          0 ? (
            <NotificationsEmptyState />
          ) : (
            <div className="space-y-7">
              <NotificationsSection
                title="New & Action Required"
                notifications={
                  unreadNotifications
                }
                highlight
                onReadAction={
                  handleRead
                }
              />

              <NotificationsSection
                title="Earlier"
                notifications={
                  earlierNotifications
                }
                onReadAction={
                  handleRead
                }
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}