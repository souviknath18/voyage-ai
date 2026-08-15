import {
  SelectHTMLAttributes,
} from "react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export default function Select({
  label,
  error,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
          {label}
        </label>
      )}

      <select
        className={`
          w-full
          rounded-lg
          border
          bg-[#211f24]
          px-4
          py-3
          text-sm
          text-[#e6e0e8]
          outline-none
          transition

          ${
            error
              ? "border-red-500"
              : "border-white/10 focus:border-[#d1bcff]/60 focus:ring-2 focus:ring-[#d1bcff]/10"
          }

          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}