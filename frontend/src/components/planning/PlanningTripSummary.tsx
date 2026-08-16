"use client";

import {
  CalendarDays,
  PlaneTakeoff,
  Users,
  WalletCards,
} from "lucide-react";

import {
  Card,
  PreferenceBadge,
} from "@/components/ui";

import type {
  PlanningTrip,
} from "@/types/planning";

interface PlanningTripSummaryProps {
  trip: PlanningTrip;
}

export default function PlanningTripSummary({
  trip,
}: PlanningTripSummaryProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Route */}
        <SummaryItem
          icon={
            <PlaneTakeoff
              size={16}
            />
          }
          label="Route"
        >
          <div className="flex items-center gap-2">
            <span>
              {trip.origin}
            </span>

            <span className="text-[#fb7185]">
              →
            </span>

            <span>
              {trip.destination}
            </span>
          </div>
        </SummaryItem>

        {/* Dates */}
        <SummaryItem
          icon={
            <CalendarDays
              size={16}
            />
          }
          label="Dates"
        >
          {trip.startDate}
          {" - "}
          {trip.endDate}
        </SummaryItem>

        {/* Travelers + Budget */}
        <SummaryItem
          icon={
            <Users size={16} />
          }
          label="Trip Details"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <span>
              {trip.travelers}{" "}
              {trip.travelers ===
              1
                ? "Traveler"
                : "Travelers"}
            </span>

            <span className="text-[#7f8798]">
              •
            </span>

            <span className="flex items-center gap-1">
              <WalletCards
                size={13}
                className="text-[#fcd34d]"
              />

              {trip.currency}{" "}
              {trip.budget.toLocaleString()}
            </span>
          </div>
        </SummaryItem>

        {/* Preferences */}
        <SummaryItem
          label="Preferences"
        >
          <div className="flex flex-wrap gap-1.5">
            <PreferenceBadge
              value={trip.pace}
            >
              {trip.pace}
            </PreferenceBadge>

            {trip.interests
              .slice(0, 2)
              .map((interest) => (
                <PreferenceBadge
                  key={interest}
                  value={interest}
                >
                  {interest}
                </PreferenceBadge>
              ))}
          </div>
        </SummaryItem>
      </div>
    </Card>
  );
}

function SummaryItem({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[#948e9c]">
        {icon}

        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">
          {label}
        </p>
      </div>

      <div className="text-sm font-medium text-[#e6e0e8]">
        {children}
      </div>
    </div>
  );
}