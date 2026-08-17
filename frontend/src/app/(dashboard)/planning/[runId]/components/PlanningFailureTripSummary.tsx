import {
  CalendarDays,
  Route,
  Users,
  WalletCards,
} from "lucide-react";

interface PlanningFailureTripSummaryProps {
  origin: string;

  destination: string;

  startDate: string;

  endDate: string;

  travelers: number;

  currency: string;

  budget: number;
}

export default function PlanningFailureTripSummary({
  origin,
  destination,
  startDate,
  endDate,
  travelers,
  currency,
  budget,
}: PlanningFailureTripSummaryProps) {
  return (
    <div className="h-full rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f8798]">
        Trip Summary
      </p>

      <div className="mt-4 space-y-3.5">
        <SummaryRow
          icon={Route}
          label={`${origin} → ${destination}`}
        />

        <SummaryRow
          icon={CalendarDays}
          label={`${startDate} - ${endDate}`}
        />

        <SummaryRow
          icon={Users}
          label={`${travelers} ${
            travelers === 1
              ? "Traveler"
              : "Travelers"
          }`}
        />

        <SummaryRow
          icon={WalletCards}
          label={`${currency} ${budget.toLocaleString()} Budget`}
        />
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  label: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon
        size={14}
        className="mt-0.5 shrink-0 text-[#948e9c]"
      />

      <p className="text-xs font-medium leading-5 text-[#cbc4d2] sm:text-[13px]">
        {label}
      </p>
    </div>
  );
}