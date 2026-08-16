"use client";

import {
  Bell,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

interface NotificationSettingsProps {
  emailNotifications: boolean;
  tripUpdates: boolean;
  priceAlerts: boolean;
  weatherAlerts: boolean;
  aiActivityAlerts: boolean;
  marketingEmails: boolean;

  onChangeAction: (
    field:
      | "emailNotifications"
      | "tripUpdates"
      | "priceAlerts"
      | "weatherAlerts"
      | "aiActivityAlerts"
      | "marketingEmails",
    value: boolean,
  ) => void;
}

export default function NotificationSettings({
  emailNotifications,
  tripUpdates,
  priceAlerts,
  weatherAlerts,
  aiActivityAlerts,
  marketingEmails,
  onChangeAction,
}: NotificationSettingsProps) {
  return (
    <section
      id="notifications"
      className="scroll-mt-24"
    >
      {/* Section Header */}
      <div className="mb-3 flex items-center gap-2">
        <Bell
          size={16}
          className="text-[#d1bcff]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Notifications
        </h2>
      </div>

      {/* Settings Card */}
      <Card className="divide-y divide-white/10 p-4 sm:p-5">
        <SettingToggle
          label="Email Notifications"
          description="Receive important VoyageAI updates by email."
          checked={
            emailNotifications
          }
          onChange={(value) =>
            onChangeAction(
              "emailNotifications",
              value,
            )
          }
        />

        <SettingToggle
          label="Trip Updates"
          description="Changes to your active or upcoming trips."
          checked={
            tripUpdates
          }
          onChange={(value) =>
            onChangeAction(
              "tripUpdates",
              value,
            )
          }
        />

        <SettingToggle
          label="Price Alerts"
          description="Notify me when shortlisted flights or hotels change price."
          checked={
            priceAlerts
          }
          onChange={(value) =>
            onChangeAction(
              "priceAlerts",
              value,
            )
          }
        />

        <SettingToggle
          label="Weather Alerts"
          description="Weather changes that could affect planned activities."
          checked={
            weatherAlerts
          }
          onChange={(value) =>
            onChangeAction(
              "weatherAlerts",
              value,
            )
          }
        />

        <SettingToggle
          label="AI Activity"
          description="Notify me when VoyageAI finishes planning or re-optimizing."
          checked={
            aiActivityAlerts
          }
          onChange={(value) =>
            onChangeAction(
              "aiActivityAlerts",
              value,
            )
          }
        />

        <SettingToggle
          label="Product Updates"
          description="Occasional product announcements and VoyageAI news."
          checked={
            marketingEmails
          }
          onChange={(value) =>
            onChangeAction(
              "marketingEmails",
              value,
            )
          }
          last
        />
      </Card>
    </section>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
  last = false,
}: {
  label: string;
  description: string;

  checked: boolean;

  onChange: (
    value: boolean,
  ) => void;

  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-5 ${
        last
          ? "pt-4"
          : "py-4 first:pt-0"
      }`}
    >
      {/* Text */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#e6e0e8]">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#948e9c]">
          {description}
        </p>
      </div>

      {/* Toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-300 ${
          checked
            ? "bg-gradient-to-r from-[#fb7185] to-[#fcd34d] shadow-[0_0_12px_rgba(251,113,133,0.18)]"
            : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}