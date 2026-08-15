import {
  TextareaHTMLAttributes,
} from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#e6e0e8]">
          {label}
        </label>
      )}

      <textarea
        className={`
          min-h-[120px]
          w-full
          resize-y
          rounded-lg
          border
          bg-white/[0.04]
          px-4
          py-3
          text-sm
          leading-6
          text-[#e6e0e8]
          outline-none
          transition

          placeholder:text-[#948e9c]

          ${
            error
              ? "border-red-500"
              : "border-white/10 focus:border-[#d1bcff]/60 focus:ring-2 focus:ring-[#d1bcff]/10"
          }

          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}