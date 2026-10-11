"use client";

import { useMemo } from "react";
import Dropdown from "@/components/ui/Dropdown";

interface TimePickerProps {
  value: string;
  onChangeAction: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

export default function TimePicker({
  value,
  onChangeAction,
  disabled = false,
  label = "Start Time",
}: TimePickerProps) {
  const [rawHour = "09", rawMinute = "00"] = value.split(":");

  const hour24 = Number(rawHour);
  const minute = Number(rawMinute);

  const hour12 = String(hour24 % 12 || 12).padStart(2, "0");
  const period = hour24 >= 12 ? "PM" : "AM";

  const hourOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const hour = String(index + 1).padStart(2, "0");
        return { label: hour, value: hour };
      }),
    [],
  );

  const minuteOptions = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => {
        const minute = String(index).padStart(2, "0");
        return { label: minute, value: minute };
      }),
    [],
  );

  const periodOptions = [
    { label: "AM", value: "AM" },
    { label: "PM", value: "PM" },
  ];

  const updateTime = (
    nextHour: string,
    nextMinute: string,
    nextPeriod: string,
  ) => {
    let convertedHour = Number(nextHour) % 12;

    if (nextPeriod === "PM") {
      convertedHour += 12;
    }

    onChangeAction(
      `${String(convertedHour).padStart(2, "0")}:${nextMinute}`,
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2 [&_.max-h-60]:!max-h-36">
        <div className="min-w-0 flex-1">
          <Dropdown
            value={hour12}
            options={hourOptions}
            onChangeAction={(hour) =>
              updateTime(hour, rawMinute, period)
            }
            disabled={disabled}
          />
        </div>

        <span className="text-[#e6e0e8]">:</span>

        <div className="min-w-0 flex-1">
          <Dropdown
            value={String(minute).padStart(2, "0")}
            options={minuteOptions}
            onChangeAction={(nextMinute) =>
              updateTime(hour12, nextMinute, period)
            }
            disabled={disabled}
          />
        </div>

        <div className="min-w-0 flex-1">
          <Dropdown
            value={period}
            options={periodOptions}
            onChangeAction={(nextPeriod) =>
              updateTime(hour12, rawMinute, nextPeriod)
            }
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}