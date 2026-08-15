import {
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export default function Input({
  label,
  error,
  leftIcon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[#948e9c]">
            {leftIcon}
          </div>
        )}

        <input
          className={`w-full rounded-lg border bg-white/[0.04] px-4 py-3 text-sm text-[#e6e0e8] outline-none transition placeholder:text-[#948e9c] ${leftIcon ? "pl-10" : ""} ${error ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-[#d1bcff]/60 focus:ring-2 focus:ring-[#d1bcff]/10"} ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}