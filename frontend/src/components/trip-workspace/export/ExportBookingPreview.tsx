
import {
  Building2,
  Plane,
} from "lucide-react";

import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

interface ExportBookingPreviewProps {
  trip: TripWorkspaceData;
  masked: boolean;
}

function formatPrice(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[#7f8798]">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-[#cbc4d2]">
        {value}
      </p>
    </div>
  );
}

function SelectionBadge() {
  return (
    <span className="rounded-md border border-[#C4B5FD]/20 bg-[#C4B5FD]/10 px-2 py-1 text-[10px] font-semibold text-[#C4B5FD]">
      Selected
    </span>
  );
}

export default function ExportBookingPreview({
  trip,
  masked: _masked,
}: ExportBookingPreviewProps) {
  const flights = trip.flights ?? [];

  const selectedHotel = trip.hotelOptions.find(
    (hotel) => hotel.current,
  );

  return (
    <div className="space-y-8">
      {/* Flight Details */}
      <section>
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Plane
            size={18}
            className="text-[#fb7185]"
          />

          <h2 className="text-base font-semibold text-[#e6e0e8]">
            Flight Details
          </h2>
        </div>

        {flights.length > 0 ? (
          <div className="mt-4 space-y-3">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#e6e0e8]">
                      {flight.airline}{" "}
                      {flight.flightNumber}
                    </p>

                    <p className="mt-1 text-xs text-[#948e9c]">
                      {flight.route}
                    </p>
                  </div>

                  <SelectionBadge />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Detail
                    label="Departure"
                    value={flight.departureTime}
                  />

                  <Detail
                    label="Cabin"
                    value={flight.cabin}
                  />

                  <Detail
                    label="Journey"
                    value={
                      flight.type === "return"
                        ? "Return"
                        : "Outbound"
                    }
                  />

                  <Detail
                    label="Route"
                    value={`${flight.from} → ${flight.to}`}
                  />
                </div>

                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
                    Selected Offer Price
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#e6e0e8]">
                    {flight.type === "return" &&
                    flight.price === 0
                      ? "Included in total flight offer"
                      : formatPrice(
                          flight.price,
                          trip.currency,
                        )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-sm font-medium text-[#e6e0e8]">
              No flight selected
            </p>

            <p className="mt-2 text-xs text-[#948e9c]">
              Select a flight to include its details
              in your trip export.
            </p>
          </div>
        )}
      </section>

      {/* Hotel Details */}
      <section>
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Building2
            size={18}
            className="text-[#fb7185]"
          />

          <h2 className="text-base font-semibold text-[#e6e0e8]">
            Accommodation Details
          </h2>
        </div>

        {selectedHotel ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#e6e0e8]">
                  {selectedHotel.name}
                </p>

                <p className="mt-1 text-xs text-[#948e9c]">
                  {selectedHotel.location}
                </p>
              </div>

              <SelectionBadge />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <Detail
                label="Room"
                value={selectedHotel.room}
              />

              <Detail
                label="Duration"
                value={`${selectedHotel.nights} night${
                  selectedHotel.nights === 1 ? "" : "s"
                }`}
              />

              <Detail
                label="Check-in"
                value={trip.startDate}
              />

              <Detail
                label="Check-out"
                value={trip.endDate}
              />
            </div>

            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
                Selected Hotel Price
              </p>

              <p className="mt-2 text-sm font-semibold text-[#e6e0e8]">
                {formatPrice(
                  selectedHotel.totalPrice ??
                    selectedHotel.pricePerNight *
                      selectedHotel.nights,
                  trip.currency,
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <p className="text-sm font-medium text-[#e6e0e8]">
              No hotel selected
            </p>

            <p className="mt-2 text-xs text-[#948e9c]">
              Select a hotel to include its details
              in your trip export.
            </p>
          </div>
        )}
      </section>

      <p className="text-[11px] leading-relaxed text-[#948e9c]">
        Flight and accommodation details represent saved
        selections, not confirmed reservations.
        Prices and availability may change before booking.
      </p>
    </div>
  );
}