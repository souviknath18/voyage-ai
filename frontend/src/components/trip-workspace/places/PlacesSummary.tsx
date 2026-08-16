import {
  Bookmark,
  MapPin,
  Route,
  WalletCards,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

interface PlacesSummaryProps {
  totalPlaces: number;
  savedPlaces: number;

  estimatedSpend: number;

  coverage: number;

  currency: string;
}

export default function PlacesSummary({
  totalPlaces,
  savedPlaces,
  estimatedSpend,
  coverage,
  currency,
}: PlacesSummaryProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryItem
          icon={MapPin}
          label="Total Places"
          value={String(totalPlaces)}
        />

        <SummaryItem
          icon={Bookmark}
          label="Saved"
          value={String(savedPlaces)}
          accent="violet"
        />

        <SummaryItem
          icon={WalletCards}
          label="Est. Spend"
          value={`${currency} ${estimatedSpend.toLocaleString()}`}
          accent="amber"
        />

        <SummaryItem
          icon={Route}
          label="Itinerary Coverage"
          value={`${coverage}%`}
          accent="coral"
        />
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#fb7185] to-[#fcd34d] transition-[width] duration-700"
          style={{
            width: `${Math.min(
              coverage,
              100,
            )}%`,
          }}
        />
      </div>
    </Card>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{
    size?: number;
  }>;

  label: string;
  value: string;

  accent?:
    | "violet"
    | "amber"
    | "coral";
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[#7f8798]">
        <Icon size={13} />

        <p className="text-[9px] font-semibold uppercase tracking-wider">
          {label}
        </p>
      </div>

      <p
        className={`mt-1.5 text-base font-semibold sm:text-lg ${
          accent === "violet"
            ? "text-[#d1bcff]"
            : accent === "amber"
              ? "text-[#fcd34d]"
              : accent === "coral"
                ? "text-[#fb7185]"
                : "text-[#e6e0e8]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}