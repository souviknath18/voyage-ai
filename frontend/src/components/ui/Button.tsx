import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

type ButtonSize =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "voyage-gradient text-[#24103F] shadow-[0_8px_25px_rgba(251,113,133,0.2)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(251,113,133,0.3)]",

    secondary:
      "bg-[#d1bcff] text-[#24103F] hover:bg-[#eaddff]",

    outline:
      "border border-white/10 bg-white/[0.04] text-[#e6e0e8] hover:border-[#d1bcff]/30 hover:bg-white/[0.07]",

    ghost:
      "text-[#cbc4d2] hover:bg-white/[0.06] hover:text-[#e6e0e8]",

    danger:
      "bg-[#93000a] text-white hover:bg-[#b91c1c]",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}