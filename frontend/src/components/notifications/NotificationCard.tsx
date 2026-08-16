"use client";

import Link from "next/link";

import {
  Bot,
  CheckCircle2,
  CloudRain,
  DollarSign,
  Sparkles,
  TriangleAlert,
  WalletCards,
} from "lucide-react";

import type {
  NotificationType,
  VoyageNotification,
} from "@/types/notifications";

interface NotificationCardProps {
  notification:
    VoyageNotification;

  onReadAction: (
    id: string,
  ) => void;
}

const typeConfig: Record<
  NotificationType,
  {
    icon:
      React.ComponentType<{
        size?: number;
        className?: string;
      }>;

    iconClass: string;

    iconContainer: string;

    categoryClass:
      string;
  }
> = {
  agent: {
    icon: Bot,

    iconClass:
      "text-[#d1bcff]",

    iconContainer:
      "border-[#d1bcff]/20 bg-[#d1bcff]/10",

    categoryClass:
      "text-[#d1bcff]",
  },

  trip: {
    icon:
      TriangleAlert,

    iconClass:
      "text-[#fb7185]",

    iconContainer:
      "border-[#fb7185]/20 bg-[#fb7185]/10",

    categoryClass:
      "text-[#fb7185]",
  },

  price: {
    icon:
      DollarSign,

    iconClass:
      "text-[#fcd34d]",

    iconContainer:
      "border-[#fcd34d]/20 bg-[#fcd34d]/10",

    categoryClass:
      "text-[#fcd34d]",
  },

  weather: {
    icon:
      CloudRain,

    iconClass:
      "text-sky-300",

    iconContainer:
      "border-sky-300/20 bg-sky-300/10",

    categoryClass:
      "text-sky-300",
  },

  budget: {
    icon:
      WalletCards,

    iconClass:
      "text-emerald-400",

    iconContainer:
      "border-emerald-400/20 bg-emerald-400/10",

    categoryClass:
      "text-emerald-400",
  },

  system: {
    icon:
      CheckCircle2,

    iconClass:
      "text-[#948e9c]",

    iconContainer:
      "border-white/10 bg-white/[0.04]",

    categoryClass:
      "text-[#948e9c]",
  },
};

export default function NotificationCard({
  notification,
  onReadAction,
}: NotificationCardProps) {
  const config =
    typeConfig[
      notification.type
    ];

  const Icon =
    config.icon;

  const unread =
    notification.status ===
    "unread";

  return (
    <article
      onClick={() =>
        onReadAction(
          notification.id,
        )
      }
      className={`group relative overflow-hidden rounded-xl border p-4 transition sm:p-5 ${
        unread
          ? "border-[#fb7185]/25 bg-[#fb7185]/[0.035] shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          : "border-white/10 bg-white/[0.025] hover:bg-white/[0.04]"
      }`}
    >
      {/* Unread Accent */}
      {unread && (
        <>
          <div className="absolute bottom-4 left-0 top-4 w-[3px] rounded-r-full bg-[#fb7185]" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fb7185]/[0.04] to-transparent" />
        </>
      )}

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${config.iconContainer}`}
        >
          <Icon
            size={19}
            className={
              config.iconClass
            }
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${config.categoryClass}`}
            >
              {
                notification.category
              }
            </span>

            {notification.tripName && (
              <>
                <span className="h-1 w-1 rounded-full bg-white/20" />

                <span className="text-[11px] text-[#948e9c]">
                  {
                    notification.tripName
                  }
                </span>
              </>
            )}

            <span className="h-1 w-1 rounded-full bg-white/20" />

            <span
              className={`text-[11px] ${
                unread
                  ? "text-[#fb7185]"
                  : "text-[#7f8798]"
              }`}
            >
              {
                notification.time
              }
            </span>
          </div>

          {/* Title */}
          <div className="mt-1.5 flex items-start gap-2">
            <h2 className="text-sm font-semibold leading-5 text-[#e6e0e8] sm:text-[15px]">
              {
                notification.title
              }
            </h2>

            {unread && (
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#fb7185]" />
            )}
          </div>

          {/* Description */}
          <p className="mt-1.5 max-w-3xl text-xs leading-5 text-[#948e9c] sm:text-[13px]">
            {
              notification.description
            }
          </p>
        </div>

        {/* Action */}
        {notification.actionLabel &&
          notification.actionHref && (
            <div className="shrink-0">
              <Link
                href={
                  notification.actionHref
                }
                onClick={(event) =>
                  event.stopPropagation()
                }
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  notification.type ===
                  "agent"
                    ? "border-[#fb7185]/25 bg-[#fb7185]/10 text-[#fb7185] hover:bg-[#fb7185]/15"
                    : notification.type ===
                        "trip"
                      ? "border-red-400/25 text-red-400 hover:bg-red-400/[0.07]"
                      : "border-white/10 bg-white/[0.03] text-[#cbc4d2] hover:bg-white/[0.06]"
                }`}
              >
                {notification.type ===
                  "agent" && (
                  <Sparkles
                    size={12}
                  />
                )}

                {
                  notification.actionLabel
                }
              </Link>
            </div>
          )}
      </div>
    </article>
  );
}