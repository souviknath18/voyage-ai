import {
  CalendarDays,
  Hotel,
  Plane,
  Users,
  WalletCards,
} from "lucide-react";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

interface TripAssistantContextProps {
  trip: TripWorkspaceData;
}

export default function TripAssistantContext({
  trip,
}: TripAssistantContextProps) {
  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-white/10 bg-white/[0.02] p-4 xl:block">
      {/* Section Label */}
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f8798]">
        Current Trip Context
      </p>

      {/* Trip Card */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {/* Route */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#7f8798]">
              From
            </p>

            <p className="mt-1 text-sm font-semibold text-[#e6e0e8]">
              {trip.originCode ??
                trip.origin}
            </p>
          </div>

          <Plane
            size={17}
            className="text-[#fb7185]"
          />

          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#7f8798]">
              To
            </p>

            <p className="mt-1 text-sm font-semibold text-[#e6e0e8]">
              {trip.destinationCode ??
                trip.destination}
            </p>
          </div>
        </div>

        {/* Trip Details */}
        <div className="mt-4 space-y-3.5 border-t border-white/10 pt-4">
          <ContextRow
            icon={CalendarDays}
            label="Dates"
            value={`${trip.startDate} - ${trip.endDate}`}
          />

          <ContextRow
            icon={Users}
            label="Travelers"
            value={`${trip.travelers}`}
          />

          <ContextRow
            icon={WalletCards}
            label="Budget"
            value={`${trip.currency} ${trip.totalBudget.toLocaleString()}`}
          />

          <ContextRow
            icon={Hotel}
            label="Hotel"
            value={trip.hotel.name}
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7f8798]">
          Active Preferences
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Balanced Pace",
            "Technology",
            "Food",
            "Photography",
          ].map(
            (preference) => (
              <span
                key={preference}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-medium text-[#cbc4d2]"
              >
                {preference}
              </span>
            ),
          )}
        </div>
      </div>
    </aside>
  );
}

function ContextRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  label: string;

  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        size={14}
        className="mt-0.5 shrink-0 text-[#948e9c]"
      />

      <div className="min-w-0">
        <p className="text-[10px] font-medium text-[#7f8798]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[13px] font-medium leading-5 text-[#cbc4d2]">
          {value}
        </p>
      </div>
    </div>
  );
}