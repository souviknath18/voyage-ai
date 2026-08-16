import {
  Clock3,
  Coins,
  Store,
  Sunset,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

interface PlaceMetadataCardProps {
  duration: string;

  estimatedCost: number;

  currency: string;

  openingHours: string;

  bestTime: string;
}

export default function PlaceMetadataCard({
  duration,
  estimatedCost,
  currency,
  openingHours,
  bestTime,
}: PlaceMetadataCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-base font-semibold text-[#e6e0e8]">
        Details
      </h2>

      <div className="mt-4 space-y-4">
        <DetailItem
          icon={Clock3}
          label="Duration"
          value={duration}
        />

        <DetailItem
          icon={Coins}
          label="Estimated Cost"
          value={
            estimatedCost >
            0
              ? `${currency} ${estimatedCost.toLocaleString()}`
              : "Free"
          }
          accent="coral"
        />

        <DetailItem
          icon={Store}
          label="Opening Hours"
          value={
            openingHours
          }
        />

        <DetailItem
          icon={Sunset}
          label="Best Time"
          value={bestTime}
          accent="amber"
          last
        />
      </div>
    </Card>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  accent,
  last = false,
}: {
  icon: React.ComponentType<{
    size?: number;
  }>;

  label: string;

  value: string;

  accent?:
    | "coral"
    | "amber";

  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${
        !last
          ? "border-b border-white/10 pb-4"
          : ""
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[#d1bcff]">
        <Icon size={15} />
      </div>

      <div>
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
          {label}
        </p>

        <p
          className={`mt-1 text-sm font-medium ${
            accent ===
            "coral"
              ? "text-[#fb7185]"
              : accent ===
                  "amber"
                ? "text-[#fcd34d]"
                : "text-[#e6e0e8]"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}