"use client";

import {
  Card,
  DateRangePicker,
} from "@/components/ui";

import {
  Plane,
} from "lucide-react";

import TravelerCounter from "./TravelerCounter";
import LocationAutocomplete from "@/components/plan-trip/LocationAutocomplete";
import type { LocationSuggestion } from "@/types/location";


interface CoreTripDetailsProps {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;

  originLocation: LocationSuggestion | null;
  destinationLocation: LocationSuggestion | null;

  onOriginLocationSelectAction: (
    location: LocationSuggestion | null,
  ) => void;

  onDestinationLocationSelectAction: (
    location: LocationSuggestion | null,
  ) => void;

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

  originLocation,
  destinationLocation,

  onOriginLocationSelectAction,
  onDestinationLocationSelectAction,

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
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
            Origin
          </label>

          <LocationAutocomplete
            value={origin}
            selectedLocation={originLocation}
            placeholder="e.g. Bengaluru, India"
            onValueChange={onOriginChangeAction}
            onLocationSelect={
              onOriginLocationSelectAction
            }
          />
        </div>

        {/* Destination */}
        <div>
          <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
            Destination
          </label>

          <LocationAutocomplete
            value={destination}
            selectedLocation={destinationLocation}
            placeholder="e.g. Tokyo, Japan"
            onValueChange={onDestinationChangeAction}
            onLocationSelect={
              onDestinationLocationSelectAction
            }
          />
        </div>

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
          onChangeAction={
            onTravelersChangeAction
          }
        />
      </div>
    </Card>
  );
}