import { ReactNode } from "react";

type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    primary:
      "border-[#d1bcff]/30 bg-[#d1bcff]/10 text-[#d1bcff]",

    success:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",

    warning:
      "border-[#fcd34d]/30 bg-[#fcd34d]/10 text-[#fcd34d]",

    danger:
      "border-red-400/30 bg-red-400/10 text-red-300",

    neutral:
      "border-white/10 bg-white/[0.05] text-[#cbc4d2]",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-md
        border
        px-2.5
        py-1
        text-[11px]
        font-bold
        uppercase
        tracking-wider

        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}