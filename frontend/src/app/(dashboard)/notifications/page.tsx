"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import NotificationsEmptyState from "@/components/notifications/NotificationsEmptyState";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";
import NotificationsSection from "@/components/notifications/NotificationsSection";

import {
  mockNotifications,
} from "@/data/mock-notifications";

import type {
  VoyageNotification,
} from "@/types/notifications";

export default function NotificationsPage() {
  const router =
    useRouter();

  const [
    notifications,
    setNotifications,
  ] =
    useState<
      VoyageNotification[]
    >(
      mockNotifications,
    );

  const [
    filter,
    setFilter,
  ] =
    useState(
      "all",
    );

  const filteredNotifications =
    useMemo(() => {
      if (
        filter === "all"
      ) {
        return notifications;
      }

      return notifications.filter(
        (notification) =>
          notification.type ===
          filter,
      );
    }, [
      notifications,
      filter,
    ]);

  const unreadNotifications =
    filteredNotifications.filter(
      (notification) =>
        notification.status ===
        "unread",
    );

  const earlierNotifications =
    filteredNotifications.filter(
      (notification) =>
        notification.status ===
        "read",
    );

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.status ===
        "unread",
    ).length;

  const handleRead = (
    id: string,
  ) => {
    setNotifications(
      (previous) =>
        previous.map(
          (notification) =>
            notification.id ===
            id
              ? {
                  ...notification,

                  status:
                    "read",
                }
              : notification,
        ),
    );
  };

  const handleMarkAllRead =
    () => {
      setNotifications(
        (previous) =>
          previous.map(
            (
              notification,
            ) => ({
              ...notification,

              status:
                "read",
            }),
          ),
      );
    };

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