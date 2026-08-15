"use client";

import {
  ChevronDown,
  Check,
} from "lucide-react";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export interface DropdownOption {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChangeAction: (value: string) => void;

  label?: string;
  placeholder?: string;
  error?: string;

  className?: string;
  disabled?: boolean;
}

export default function Dropdown({
  value,
  options,
  onChangeAction,
  label,
  placeholder = "Select option",
  error,
  className = "",
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find(
      (option) =>
        option.value === value,
    );

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
    optionValue: string,
  ) => {
    onChangeAction(optionValue);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          setOpen(
            (previous) => !previous,
          )
        }
        className={`flex h-[46px] w-full items-center justify-between rounded-lg border bg-white/[0.04] px-3 text-left text-sm outline-none transition disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? "border-red-500"
            : open
              ? "border-[#d1bcff]/60 ring-2 ring-[#d1bcff]/10"
              : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          {selectedOption?.icon && (
            <span className="shrink-0 text-[#948e9c]">
              {selectedOption.icon}
            </span>
          )}

          <span
            className={
              selectedOption
                ? "truncate text-[#e6e0e8]"
                : "truncate text-[#948e9c]"
            }
          >
            {selectedOption
              ? selectedOption.label
              : placeholder}
          </span>
        </div>

        <ChevronDown
          size={15}
          className={`shrink-0 text-[#948e9c] transition-transform duration-200 ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {error && (
        <p className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}

      {open && !disabled && (
        <div className="absolute left-0 top-[54px] z-50 w-full min-w-[140px] overflow-hidden rounded-lg border border-white/10 bg-[#0D1324] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const active =
                option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleSelect(
                      option.value,
                    )
                  }
                  className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-[#d1bcff]/10 text-[#d1bcff]"
                      : "text-[#cbc4d2] hover:bg-white/[0.06] hover:text-[#e6e0e8]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {option.icon && (
                      <span className="shrink-0 text-[#948e9c]">
                        {option.icon}
                      </span>
                    )}

                    <span className="truncate">
                      {option.label}
                    </span>
                  </div>

                  {active && (
                    <Check
                      size={14}
                      className="shrink-0 text-[#d1bcff]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}