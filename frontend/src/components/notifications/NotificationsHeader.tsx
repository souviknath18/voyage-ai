"use client";

import {
  Bell,
  CheckCheck,
  Filter,
  Settings,
} from "lucide-react";

import {
  Button,
  Dropdown,
} from "@/components/ui";

interface NotificationsHeaderProps {
  filter: string;

  unreadCount: number;

  onFilterChangeAction: (
    value: string,
  ) => void;

  onMarkAllReadAction:
    () => void;

  onSettingsAction:
    () => void;
}

const filterOptions = [
  {
    label:
      "All Categories",
    value:
      "all",
  },
  {
    label:
      "AI Agent",
    value:
      "agent",
  },
  {
    label:
      "Trip Updates",
    value:
      "trip",
  },
  {
    label:
      "Price Changes",
    value:
      "price",
  },
  {
    label:
      "Weather",
    value:
      "weather",
  },
  {
    label:
      "Budget",
    value:
      "budget",
  },
];

export default function NotificationsHeader({
  filter,
  unreadCount,
  onFilterChangeAction,
  onMarkAllReadAction,
  onSettingsAction,
}: NotificationsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pt-2.5 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
      {/* Heading */}
      <div>
        <div className="flex items-center gap-2">
          <Bell
            size={19}
            className="text-[#fb7185]"
          />

          <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
            Notifications
          </h1>

          {unreadCount > 0 && (
            <span className="rounded-full border border-[#fb7185]/20 bg-[#fb7185]/10 px-2 py-0.5 text-[10px] font-semibold text-[#fb7185]">
              {unreadCount} new
            </span>
          )}
        </div>

        <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#948e9c]">
          Travel updates, AI activity and important changes across your trips.
        </p>
      </div>

      {/* Controls */}
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="w-full sm:w-44">
          <Dropdown
            value={filter}
            options={
              filterOptions
            }
            onChangeAction={
              onFilterChangeAction
            }
            placeholder="All Categories"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={
            onMarkAllReadAction
          }
        >
          <CheckCheck
            size={14}
          />

          Mark All Read
        </Button>

        <button
          type="button"
          aria-label="Notification settings"
          onClick={
            onSettingsAction
          }
          className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#948e9c] transition hover:bg-white/[0.06] hover:text-[#e6e0e8] sm:flex"
        >
          <Settings
            size={15}
          />
        </button>
      </div>
    </div>
  );
}