import type {
  SharedTripDay,
} from "@/types/shared-trip";

import SharedTripDayItem from "./SharedTripDay";

interface SharedTripTimelineProps {
  days:
    SharedTripDay[];
}

export default function SharedTripTimeline({
  days,
}: SharedTripTimelineProps) {
  return (
    <section>
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#fb7185]">
          Your Journey
        </p>

        <h2 className="mt-1 text-xl font-semibold text-[#e6e0e8]">
          Day-by-day itinerary
        </h2>
      </div>

      <div>
        {days.map(
          (
            day,
            index,
          ) => (
            <SharedTripDayItem
              key={day.id}
              day={day}
              last={
                index ===
                days.length - 1
              }
            />
          ),
        )}
      </div>
    </section>
  );
}