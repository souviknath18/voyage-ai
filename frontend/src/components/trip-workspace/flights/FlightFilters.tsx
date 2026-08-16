"use client";

interface FlightFiltersProps {
  nonStop: boolean;
  oneStop: boolean;

  airlines: string[];

  selectedAirlines: string[];

  onNonStopChangeAction: (
    value: boolean,
  ) => void;

  onOneStopChangeAction: (
    value: boolean,
  ) => void;

  onAirlineChangeAction: (
    airline: string,
    checked: boolean,
  ) => void;

  onResetAction: () => void;
}

export default function FlightFilters({
  nonStop,
  oneStop,
  airlines,
  selectedAirlines,
  onNonStopChangeAction,
  onOneStopChangeAction,
  onAirlineChangeAction,
  onResetAction,
}: FlightFiltersProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#e6e0e8]">
          Filters
        </h2>

        <button
          type="button"
          onClick={onResetAction}
          className="text-xs font-semibold text-[#d1bcff] transition hover:text-[#fb7185]"
        >
          Reset
        </button>
      </div>

      {/* Stops */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
          Stops
        </p>

        <div className="mt-3 space-y-3">
          {/* Non-stop */}
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[#cbc4d2]">
            <input
              type="checkbox"
              checked={nonStop}
              onChange={(event) =>
                onNonStopChangeAction(
                  event.target.checked,
                )
              }
              className="h-3.5 w-3.5 rounded border-white/20 bg-[#0D1324] accent-[#fb7185]"
            />

            Non-stop
          </label>

          {/* 1 Stop */}
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[#cbc4d2]">
            <input
              type="checkbox"
              checked={oneStop}
              onChange={(event) =>
                onOneStopChangeAction(
                  event.target.checked,
                )
              }
              className="h-3.5 w-3.5 rounded border-white/20 bg-[#0D1324] accent-[#fb7185]"
            />

            1 Stop
          </label>
        </div>
      </div>

      {/* Airlines */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
          Airlines
        </p>

        <div className="mt-3 space-y-3">
          {airlines.map((airline) => {
            const checked =
              selectedAirlines.includes(
                airline,
              );

            return (
              <label
                key={airline}
                className="flex cursor-pointer items-center gap-2 text-xs text-[#cbc4d2]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) =>
                    onAirlineChangeAction(
                      airline,
                      event.target
                        .checked,
                    )
                  }
                  className="h-3.5 w-3.5 rounded border-white/20 bg-[#0D1324] accent-[#fb7185]"
                />

                {airline}
              </label>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
          Sort
        </p>

        <p className="mt-2 text-xs text-[#948e9c]">
          VoyageAI recommendation
        </p>
      </div>
    </div>
  );
}