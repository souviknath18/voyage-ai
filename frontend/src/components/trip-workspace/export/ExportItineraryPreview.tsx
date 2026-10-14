
import { CalendarDays } from "lucide-react";

import type {
  ItineraryDayData,
} from "@/types/trip-workspace";

interface ExportItineraryPreviewProps {
  itinerary: ItineraryDayData[];
  currency: string;
}

function formatDate(date: string): string {
  if (!date) return "Date unavailable";

  const parsed = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? `${date}T00:00:00`
      : date,
  );

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCost(
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

export default function ExportItineraryPreview({
  itinerary,
  currency,
}: ExportItineraryPreviewProps) {
  const days = [...itinerary].sort(
    (a, b) => a.dayNumber - b.dayNumber,
  );

  return (
    <section>
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <CalendarDays
          size={18}
          className="text-[#fb7185]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Itinerary Overview
        </h2>
      </div>

      {days.length > 0 ? (
        <div className="ml-2 mt-5 space-y-6 border-l border-white/10 pl-5">
          {days.map((day, index) => (
            <PreviewDay
              key={day.id}
              day={day}
              currency={currency}
              accent={index % 2 === 1 ? "coral" : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.025] p-5 text-center">
          <p className="text-sm font-medium text-[#e6e0e8]">
            No itinerary available
          </p>

          <p className="mt-2 text-xs leading-5 text-[#948e9c]">
            Generate an itinerary for this trip to include
            its activities in the export.
          </p>
        </div>
      )}
    </section>
  );
}

function PreviewDay({
  day,
  currency,
  accent,
}: {
  day: ItineraryDayData;
  currency: string;
  accent?: "coral";
}) {
  const description = day.activities
    .map((activity) => activity.title)
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="relative">
      <span
        className={`absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[#141218] ${
          accent === "coral"
            ? "bg-[#fb7185]"
            : "bg-[#fcd34d]"
        }`}
      />

      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
        Day {day.dayNumber}
      </p>

      <h3 className="mt-1 text-sm font-semibold text-[#e6e0e8]">
        {day.title}
      </h3>

      <p className="mt-1 text-[11px] text-[#948e9c]">
        {formatDate(day.date)}
      </p>

      <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.025] p-3">
        <p className="text-xs leading-5 text-[#cbc4d2]">
          {description || "No activities planned for this day."}
        </p>

        {day.activities.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
            {day.activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#e6e0e8]">
                    {activity.title}
                  </p>

                  {(activity.startTime || activity.location) && (
                    <p className="mt-1 text-[11px] text-[#948e9c]">
                      {[
                        activity.startTime,
                        activity.location,
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  )}
                </div>

                {activity.estimatedCost != null && (
                  <span className="shrink-0 text-[11px] text-[#cbc4d2]">
                    {formatCost(
                      activity.estimatedCost,
                      currency,
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}