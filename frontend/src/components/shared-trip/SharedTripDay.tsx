import {
  BedDouble,
  Car,
  CircleDot,
  MapPin,
  PlaneLanding,
  Utensils,
} from "lucide-react";

import {
  ThumbnailImage,
} from "@/components/ui";

import type {
  SharedTripDay as SharedTripDayType,
} from "@/types/shared-trip";

interface SharedTripDayProps {
  day:
    SharedTripDayType;

  last?: boolean;
}

const iconMap = {
  arrival:
    PlaneLanding,

  hotel:
    BedDouble,

  activity:
    MapPin,

  food:
    Utensils,

  transport:
    Car,
};

export default function SharedTripDay({
  day,
  last = false,
}: SharedTripDayProps) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline */}
      <div className="relative flex shrink-0 flex-col items-center">
        <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#fb7185]/30 bg-[#fb7185]/10">
          <span className="text-[10px] font-semibold text-[#fb7185]">
            {day.day}
          </span>
        </div>

        {!last && (
          <div className="absolute bottom-[-20px] top-7 w-px bg-gradient-to-b from-[#fb7185]/40 to-[#fcd34d]/20" />
        )}
      </div>

      {/* Day */}
      <div className="mb-7 min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#7f8798]">
              Day {day.day}
            </p>

            <h3 className="mt-1 text-base font-semibold text-[#e6e0e8]">
              {day.title}
            </h3>
          </div>

          {day.date && (
            <span className="text-xs text-[#948e9c]">
              {day.date}
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {day.activities.map(
            (activity) => {
              const Icon =
                iconMap[
                  activity.type
                ] ??
                CircleDot;

              return (
                <div
                  key={
                    activity.id
                  }
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
                >
                  {activity.image ? (
                    <ThumbnailImage
                      src={
                        activity.image
                      }
                      alt={
                        activity.title
                      }
                      className="h-14 w-14 shrink-0 rounded-lg"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#d1bcff]">
                      <Icon
                        size={16}
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {activity.time && (
                        <span className="text-[10px] font-semibold text-[#fcd34d]">
                          {
                            activity.time
                          }
                        </span>
                      )}

                      {activity.status && (
                        <span className="rounded-md border border-[#d1bcff]/15 bg-[#d1bcff]/[0.06] px-2 py-0.5 text-[9px] text-[#d1bcff]">
                          {
                            activity.status
                          }
                        </span>
                      )}
                    </div>

                    <h4 className="mt-1 text-sm font-semibold text-[#e6e0e8]">
                      {
                        activity.title
                      }
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-[#948e9c]">
                      {
                        activity.description
                      }
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}