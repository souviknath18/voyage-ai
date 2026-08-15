"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  DateRange,
  DayPicker,
} from "react-day-picker";

import {
  format,
  parseISO,
  startOfMonth,
} from "date-fns";

import "react-day-picker/style.css";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;

  onStartDateChangeAction: (value: string) => void;
  onEndDateChangeAction: (value: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChangeAction,
  onEndDateChangeAction,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const [month, setMonth] = useState<Date>(
    startDate
      ? startOfMonth(parseISO(startDate))
      : startOfMonth(new Date()),
  );

  const containerRef =
    useRef<HTMLDivElement>(null);

  const selectedRange: DateRange | undefined =
    startDate
      ? {
          from: parseISO(startDate),
          to: endDate
            ? parseISO(endDate)
            : undefined,
        }
      : undefined;

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleSelect = (
    range: DateRange | undefined,
  ) => {
    if (!range?.from) {
      onStartDateChangeAction("");
      onEndDateChangeAction("");
      return;
    }

    /*
     * First click:
     * only FROM exists.
     * Keep calendar open.
     */
    if (!range.to) {
      onStartDateChangeAction(
        format(
          range.from,
          "yyyy-MM-dd",
        ),
      );

      onEndDateChangeAction("");

      return;
    }

    /*
     * Second click:
     * FROM + TO exist.
     * Now close calendar.
     */
    onStartDateChangeAction(
      format(
        range.from,
        "yyyy-MM-dd",
      ),
    );

    onEndDateChangeAction(
      format(
        range.to,
        "yyyy-MM-dd",
      ),
    );

    setOpen(false);
  };

  const formatDisplayDate = (
    value: string,
  ) => {
    return format(
      parseISO(value),
      "dd MMM yyyy",
    );
  };

  const handleToggleCalendar = () => {
    if (!open) {
      setMonth(
        startDate
          ? startOfMonth(
              parseISO(startDate),
            )
          : startOfMonth(
              new Date(),
            ),
      );
    }

    setOpen(
      (previous) => !previous,
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      {/* Input */}
      <button
        type="button"
        onClick={handleToggleCalendar}
        className="flex h-[46px] w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 text-left text-sm text-[#e6e0e8] outline-none transition hover:border-white/20 focus:border-[#d1bcff]/60 focus:ring-2 focus:ring-[#d1bcff]/10"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <CalendarDays
            size={15}
            className="shrink-0 text-[#948e9c]"
          />

          <span
            className={
              startDate
                ? "truncate text-[#e6e0e8]"
                : "truncate text-[#948e9c]"
            }
          >
            {!startDate
              ? "Select departure & return dates"
              : !endDate
                ? `${formatDisplayDate(
                    startDate,
                  )} → Select return date`
                : `${formatDisplayDate(
                    startDate,
                  )} → ${formatDisplayDate(
                    endDate,
                  )}`}
          </span>
        </div>

        <ChevronDown
          size={15}
          className={`shrink-0 text-[#948e9c] transition-transform ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {/* Calendar */}
      {open && (
        <div className="absolute left-0 top-[54px] z-50 w-max max-w-[calc(100vw-2rem)] rounded-xl border border-white/10 bg-[#0D1324] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <DayPicker
            mode="range"

            /*
             * IMPORTANT:
             * prevents first click from becoming
             * both FROM and TO.
             */
            min={1}

            month={month}
            onMonthChange={setMonth}

            selected={selectedRange}
            onSelect={handleSelect}

            disabled={{
              before: new Date(),
            }}

            numberOfMonths={1}
            showOutsideDays

            components={{
              Chevron: ({
                orientation,
              }) => {
                if (
                  orientation ===
                  "left"
                ) {
                  return (
                    <ChevronLeft
                      size={16}
                    />
                  );
                }

                return (
                  <ChevronRight
                    size={16}
                  />
                );
              },
            }}

            classNames={{
              root:
                "relative text-[#e6e0e8]",

              months:
                "flex",

              month:
                "space-y-3",

              month_caption:
                "relative flex h-9 items-center justify-center px-10",

              caption_label:
                "text-sm font-semibold text-[#e6e0e8]",

              nav:
                "absolute left-0 right-0 top-0 z-10 flex h-9 items-center justify-between",

              button_previous:
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#948e9c] transition hover:bg-white/[0.08] hover:text-[#e6e0e8]",

              button_next:
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#948e9c] transition hover:bg-white/[0.08] hover:text-[#e6e0e8]",

              month_grid:
                "w-full border-collapse",

              weekdays:
                "grid grid-cols-7",

              weekday:
                "flex h-8 w-9 items-center justify-center text-[10px] font-medium uppercase text-[#687084]",

              week:
                "grid grid-cols-7",

              day:
                "flex h-9 w-9 items-center justify-center",

              day_button:
                "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs text-[#cbc4d2] transition hover:bg-white/[0.08] hover:text-white",

              today:
                "text-[#fcd34d]",

              selected:
                "rounded-lg bg-[#fb7185]/20 text-[#fb7185]",

              range_start:
                "rounded-l-lg bg-[#fb7185]/25 text-[#fb7185]",

              range_middle:
                "rounded-none bg-[#fb7185]/10 text-[#e6e0e8]",

              range_end:
                "rounded-r-lg bg-[#fb7185]/25 text-[#fb7185]",

              outside:
                "opacity-30",

              disabled:
                "cursor-not-allowed opacity-20",
            }}
          />
        </div>
      )}
    </div>
  );
}