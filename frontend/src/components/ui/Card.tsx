import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export default function Card({
  children,
  className = "",
  glass = true,
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl
        border
        border-white/10

        ${
          glass
            ? "voyage-glass"
            : "bg-[#211f24]"
        }

        ${className}
      `}
    >
      {children}
    </div>
  );
}