"use client";

interface MapDaySelectorProps {
  days: number[];

  selectedDay:
    | number
    | "all";

  onChangeAction: (
    day: number | "all",
  ) => void;
}

export default function MapDaySelector({
  days,
  selectedDay,
  onChangeAction,
}: MapDaySelectorProps) {
  return (
    <div className="voyage-day-scrollbar overflow-x-auto">
      <div className="flex min-w-max items-center gap-1 rounded-full border border-white/10 bg-[#070B18]/70 p-1 mb-1 backdrop-blur-xl">
        <DayButton
          label="All"
          active={
            selectedDay === "all"
          }
          onClick={() =>
            onChangeAction("all")
          }
        />

        {days.map((day) => (
          <DayButton
            key={day}
            label={`Day ${day}`}
            active={
              selectedDay === day
            }
            onClick={() =>
              onChangeAction(day)
            }
          />
        ))}
      </div>
    </div>
  );
}

function DayButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
        active
          ? "border border-[#fb7185]/30 bg-[#fb7185]/15 text-[#fb7185] shadow-[0_0_15px_rgba(251,113,133,0.12)]"
          : "text-[#948e9c] hover:bg-white/[0.05] hover:text-[#e6e0e8]"
      }`}
    >
      {label}
    </button>
  );
}