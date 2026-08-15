import {
  Badge,
  Button,
  Card,
} from "@/components/ui";

import {
  Hotel,
  Plane,
  Wallet,
} from "lucide-react";

interface UpcomingTripCardProps {
  destination: string;
  dates: string;
  duration: string;
  flightStatus: string;
  hotel: string;
  budgetStatus: string;
}

export default function UpcomingTripCard({
  destination,
  dates,
  duration,
  flightStatus,
  hotel,
  budgetStatus,
}: UpcomingTripCardProps) {
  return (
    <Card className="voyage-glow flex h-full flex-col p-6">
      <div className="mb-6 flex items-start justify-between">
        <h2 className="text-xl font-semibold text-[#e6e0e8]">
          Up Next
        </h2>

        <Badge variant="success">
          Ready
        </Badge>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-[#d1bcff]">
          {destination}
        </h3>

        <p className="mt-1 text-sm text-[#cbc4d2]">
          {dates} • {duration}
        </p>

        <div className="mt-6 space-y-1">
          <TripDetail
            icon={<Plane size={17} />}
            label="Flights"
            value={flightStatus}
          />

          <TripDetail
            icon={<Hotel size={17} />}
            label="Stay"
            value={hotel}
          />

          <TripDetail
            icon={<Wallet size={17} />}
            label="Budget"
            value={budgetStatus}
          />
        </div>
      </div>

      <Button
        variant="outline"
        fullWidth
        className="mt-6"
      >
        View Details
      </Button>
    </Card>
  );
}

function TripDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-3 last:border-none">
      <span className="flex items-center gap-2 text-sm text-[#cbc4d2]">
        <span className="text-[#d1bcff]">
          {icon}
        </span>

        {label}
      </span>

      <span className="text-sm text-[#e6e0e8]">
        {value}
      </span>
    </div>
  );
}