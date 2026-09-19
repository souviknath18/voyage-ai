"use client";

import {
  ChevronDown,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  ItineraryDayData,
} from "@/types/trip-workspace";

import WeatherIcon from "@/components/trip-workspace/WeatherIcon";

import AddActivityButton from "./AddActivityButton";
import ItineraryActivity from "./ItineraryActivity";

interface ItineraryDayProps {
  day: ItineraryDayData;

  currency: string;

  onReplaceActivityAction: (
    activityId: string,
  ) => void;

  onRemoveActivityAction: (
    activityId: string,
  ) => void;

  onAddActivityAction: (
    dayNumber: number,
  ) => void;
}

export default function ItineraryDay({
  day,
  currency,
  onReplaceActivityAction,
  onRemoveActivityAction,
  onAddActivityAction,
}: ItineraryDayProps) {
  const [expanded, setExpanded] =
    useState(true);

  return (
    <section>
      {/* Day Header */}
      <button
        type="button"
        onClick={() =>
          setExpanded(
            (previous) =>
              !previous,
          )
        }
        className="flex w-full items-center justify-between gap-4 border-b border-white/10 pb-3 text-left"
      >
        <div>
          <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
            Day {day.dayNumber}:{" "}
            {day.title}
          </h2>

          <p className="mt-1 text-xs text-[#948e9c]">
            {day.date}
            {" • "}
            Est. {currency}{" "}
            {day.estimatedCost.toLocaleString()}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Weather */}
          <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-[#cbc4d2] sm:flex">
            {day.weather.temperature !== null ? (
              <>
                <WeatherIcon
                  condition={day.weather.condition}
                  size={14}
                  className="text-[#fcd34d]"
                />

                <span>
                  {Math.round(
                    day.weather.temperature,
                  )}
                  ° • {day.weather.condition}
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">
                Forecast unavailable
              </span>
            )}
          </div>

          <ChevronDown
            size={17}
            className={`text-[#948e9c] transition-transform ${
              expanded
                ? "rotate-180"
                : ""
            }`}
          />
        </div>
      </button>

      {/* Mobile Weather */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-[#948e9c] sm:hidden">
        {day.weather.temperature !== null ? (
          <>
            <WeatherIcon
              condition={day.weather.condition}
              size={14}
              className="text-[#fcd34d]"
            />

            <span>
              {Math.round(
                day.weather.temperature,
              )}
              ° • {day.weather.condition}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">
            Forecast unavailable
          </span>
        )}
      </div>

      {/* Timeline */}
      {expanded && (
        <div className="mt-5">
          {day.activities.map(
            (
              activity,
              index,
            ) => (
              <ItineraryActivity
                key={
                  activity.id
                }
                activity={
                  activity
                }
                currency={
                  currency
                }
                last={
                  index ===
                  day.activities
                    .length -
                    1
                }
                onReplaceAction={
                  onReplaceActivityAction
                }
                onRemoveAction={
                  onRemoveActivityAction
                }
              />
            ),
          )}

          <div className="ml-[52px] sm:ml-[60px]">
            <AddActivityButton
              dayNumber={
                day.dayNumber
              }
              onAddAction={
                onAddActivityAction
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}