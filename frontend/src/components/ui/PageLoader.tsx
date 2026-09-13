import {
  LoaderCircle,
  Sparkles,
} from "lucide-react";

interface PageLoaderProps {
  title?: string;

  description?: string;
}

export default function PageLoader({
  title = "Preparing your journey",
  description = "VoyageAI is loading the latest information.",
}: PageLoaderProps) {
  return (
    <div className="flex min-h-[calc(100dvh-5rem)] w-full items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        {/* Loader */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-[#fb7185]/10 blur-xl" />

          {/* Outer Ring */}
          <div className="absolute inset-0 animate-spin rounded-full border border-white/10 border-t-[#fb7185]" />

          {/* Inner */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0D1324]">
            <Sparkles
              size={18}
              className="text-[#fcd34d]"
            />
          </div>
        </div>

        {/* Text */}
        <h2 className="mt-5 text-base font-semibold text-[#e6e0e8] sm:text-lg">
          {title}
        </h2>

        <p className="mt-1.5 max-w-xs text-xs leading-5 text-[#948e9c] sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}