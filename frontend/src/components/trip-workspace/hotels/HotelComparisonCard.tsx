"use client";

import {
  CheckCircle2,
  Hotel,
  MapPin,
  Sparkles,
  Star,
  WalletCards,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  DestinationImage,
} from "@/components/ui";

import type {
  HotelComparisonOption,
} from "@/types/trip-workspace";

interface HotelComparisonCardProps {
  hotel:
    HotelComparisonOption;

  currentHotel:
    HotelComparisonOption;

  currency: string;

  onSelectAction: (
    hotel:
      HotelComparisonOption,
  ) => void;
}

export default function HotelComparisonCard({
  hotel,
  currentHotel,
  currency,
  onSelectAction,
}: HotelComparisonCardProps) {
  const total =
    hotel.pricePerNight *
    hotel.nights;

  const currentTotal =
    currentHotel.pricePerNight *
    currentHotel.nights;

  const difference =
    total -
    currentTotal;

  return (
    <Card
      className={`group relative overflow-hidden p-0 ${
        hotel.current
          ? "border-[#fb7185]/30"
          : ""
      }`}
    >
      {/* Label */}
      {hotel.label && (
        <div className="absolute left-3 top-3 z-20">
          <HotelLabel
            label={
              hotel.label
            }
          />
        </div>
      )}

      {/* Image */}
      <DestinationImage
        src={hotel.image}
        alt={hotel.name}
        className="h-48 w-full"
        imageClassName="object-center transition-transform duration-700 group-hover:scale-[1.03]"
      />

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-[#e6e0e8]">
              {hotel.name}
            </h3>

            <p className="mt-1 flex items-center gap-1 text-xs text-[#948e9c]">
              <MapPin size={12} />

              {hotel.location}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            {Array.from({
              length:
                hotel.rating,
            }).map((_, index) => (
              <Star
                key={index}
                size={11}
                fill="currentColor"
                className="text-[#fcd34d]"
              />
            ))}
          </div>
        </div>

        {/* Room / Price */}
        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs font-medium text-[#d1bcff]">
            {hotel.room}
          </p>

          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-[#e6e0e8]">
                {currency}{" "}
                {hotel.pricePerNight.toLocaleString()}
                <span className="ml-1 text-xs font-normal text-[#948e9c]">
                  / night
                </span>
              </p>

              <p className="mt-1 text-xs text-[#948e9c]">
                Total:{" "}
                {currency}{" "}
                {total.toLocaleString()}
              </p>
            </div>

            {!hotel.current && (
              <div className="text-right">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
                  Budget Impact
                </p>

                <p
                  className={`mt-1 text-xs font-semibold ${
                    difference <
                    0
                      ? "text-emerald-400"
                      : difference >
                          0
                        ? "text-[#fcd34d]"
                        : "text-[#948e9c]"
                  }`}
                >
                  {difference <
                  0
                    ? `Save ${currency} ${Math.abs(
                        difference,
                      ).toLocaleString()}`
                    : difference >
                        0
                      ? `+${currency} ${difference.toLocaleString()}`
                      : "No change"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-4 flex flex-wrap gap-2">
          {hotel.amenities.map(
            (amenity) => (
              <span
                key={amenity}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-[#948e9c]"
              >
                {amenity}
              </span>
            ),
          )}
        </div>

        {/* Highlights */}
        <div className="mt-4 space-y-2">
          {hotel.highlights.map(
            (highlight) => (
              <div
                key={highlight}
                className="flex items-start gap-2 text-xs leading-5 text-[#948e9c]"
              >
                <CheckCircle2
                  size={13}
                  className="mt-0.5 shrink-0 text-[#fb7185]"
                />

                {highlight}
              </div>
            ),
          )}
        </div>

        {/* Action */}
        <div className="mt-5">
          {hotel.current ? (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              disabled
            >
              <Hotel size={14} />

              Current Hotel
            </Button>
          ) : (
            <Button
              size="sm"
              fullWidth
              onClick={() =>
                onSelectAction(
                  hotel,
                )
              }
            >
              <WalletCards
                size={14}
              />

              Select Hotel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function HotelLabel({
  label,
}: {
  label: NonNullable<
    HotelComparisonOption["label"]
  >;
}) {
  if (
    label ===
    "recommended"
  ) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-[#fb7185]/30 bg-[#fb7185]/15 px-2.5 py-1 text-[9px] font-semibold text-[#fb7185] backdrop-blur-xl">
        <Sparkles size={11} />

        AI Recommended
      </div>
    );
  }

  if (
    label ===
    "best-value"
  ) {
    return (
      <Badge variant="warning">
        Best Value
      </Badge>
    );
  }

  return (
    <Badge variant="neutral">
      Best Location
    </Badge>
  );
}