import {
  Plane,
} from "lucide-react";

interface PageLoaderProps {
  title?: string;
  description?: string;
}

export default function PageLoader({
  title = "Loading",
  description = "Preparing your travel experience...",
}: PageLoaderProps) {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] w-full items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center text-center">

        {/* Loader */}
        <div className="relative flex h-16 w-16 items-center justify-center">

          {/* Subtle ambient glow */}
          <div className="pointer-events-none absolute h-24 w-24 rounded-full bg-[#fb7185]/10 blur-3xl" />

          {/* Rotating ring */}
          <div className="absolute inset-0 animate-spin rounded-full border border-white/[0.07] border-t-[#fb7185] border-r-[#fb7185]/30" />

          {/* Center */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-[#0D1324] shadow-[0_0_24px_rgba(251,113,133,0.08)]">
            <Plane
              size={18}
              strokeWidth={1.8}
              className="-rotate-[18deg] text-[#fcd34d]"
            />
          </div>
        </div>

        {/* Text */}
        <h2 className="mt-5 text-sm font-semibold tracking-tight text-[#e6e0e8]">
          {title}
        </h2>

        <p className="mt-1.5 max-w-[280px] text-xs leading-5 text-[#948e9c]">
          {description}
        </p>

      </div>
    </div>
  );
}