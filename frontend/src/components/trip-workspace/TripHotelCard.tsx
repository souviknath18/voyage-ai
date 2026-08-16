import {
  Hotel,
  MapPin,
  Star,
} from "lucide-react";

import {
  Button,
  Card,
  DestinationImage,
} from "@/components/ui";

import type {
  TripHotel,
} from "@/types/trip-workspace";

interface TripHotelCardProps {
  hotel: TripHotel;

  onViewDetailsAction?: () => void;
  onCompareAction?: () => void;
}

export default function TripHotelCard({
  hotel,
  onViewDetailsAction,
  onCompareAction,
}: TripHotelCardProps) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Hotel
          size={17}
          className="text-[#d1bcff]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Accommodation
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr]">
        <DestinationImage
          src={hotel.image}
          alt={hotel.name}
          className="h-36 w-full rounded-lg sm:h-full"
        />

        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-[#e6e0e8]">
            {hotel.name}
          </h3>

          <p className="mt-1 text-xs font-medium text-[#d1bcff]">
            {hotel.room}
          </p>

          <div className="mt-2 flex items-center gap-1">
            {Array.from({
              length: hotel.rating,
            }).map((_, index) => (
              <Star
                key={index}
                size={12}
                fill="currentColor"
                className="text-[#fcd34d]"
              />
            ))}
          </div>

          <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-[#948e9c]">
            <MapPin
              size={13}
              className="mt-0.5 shrink-0"
            />

            {hotel.address}
          </p>

          {/* Actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={onViewDetailsAction}
            >
              View Details
            </Button>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={onCompareAction}
            >
              Compare
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}