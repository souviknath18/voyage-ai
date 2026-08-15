"use client";

import {
  Card,
  DateRangePicker,
  Input,
} from "@/components/ui";

import {
  MapPin,
  Navigation,
  Plane,
} from "lucide-react";

import TravelerCounter from "./TravelerCounter";

interface CoreTripDetailsProps {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;

  onOriginChangeAction: (value: string) => void;
  onDestinationChangeAction: (value: string) => void;
  onStartDateChangeAction: (value: string) => void;
  onEndDateChangeAction: (value: string) => void;
  onTravelersChangeAction: (value: number) => void;
}

export default function CoreTripDetails({
  origin,
  destination,
  startDate,
  endDate,
  travelers,
  onOriginChangeAction,
  onDestinationChangeAction,
  onStartDateChangeAction,
  onEndDateChangeAction,
  onTravelersChangeAction,
}: CoreTripDetailsProps) {
  return (
    <Card className="p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <Plane
          size={18}
          className="shrink-0 text-[#fb7185] sm:size-[19px]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
          Core Details
        </h2>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Origin */}
        <Input
          label="Origin"
          value={origin}
          onChange={(event) =>
            onOriginChangeAction(event.target.value)
          }
          placeholder="e.g. Bangalore, India"
          leftIcon={
            <Navigation size={15} />
          }
          className="text-sm"
        />

        {/* Destination */}
        <Input
          label="Destination"
          value={destination}
          onChange={(event) =>
            onDestinationChangeAction(event.target.value)
          }
          placeholder="e.g. Tokyo, Japan"
          leftIcon={
            <MapPin size={15} />
          }
          className="text-sm"
        />

        {/* Travel Dates */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
            Travel Dates
          </label>

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChangeAction={
              onStartDateChangeAction
            }
            onEndDateChangeAction={
              onEndDateChangeAction
            }
          />
        </div>

        {/* Travelers */}
        <TravelerCounter
          value={travelers}
          onChangeAction={onTravelersChangeAction}
        />
      </div>
    </Card>
  );
}