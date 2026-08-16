"use client";

interface ExportSectionToggleProps {
  label: string;

  description?: string;

  checked: boolean;

  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  onChangeAction: (
    value: boolean,
  ) => void;
}

export default function ExportSectionToggle({
  label,
  description,
  checked,
  icon: Icon,
  onChangeAction,
}: ExportSectionToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() =>
        onChangeAction(
          !checked,
        )
      }
      className="group flex w-full items-center justify-between gap-4 rounded-lg py-2.5 text-left transition"
    >
      {/* Left */}
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] transition group-hover:bg-white/[0.06]">
          <Icon
            size={15}
            className="text-[#fcd34d]"
          />
        </div>

        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-medium leading-5 text-[#e6e0e8]">
            {label}
          </p>

          {description && (
            <p className="mt-1 max-w-[210px] text-[11px] leading-[17px] text-[#7f8798]">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Switch */}
      <div
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
          checked
            ? "bg-gradient-to-r from-[#fb7185] to-[#fcd34d]"
            : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked
              ? "translate-x-[20px]"
              : "translate-x-1"
          }`}
        />
      </div>
    </button>
  );
}