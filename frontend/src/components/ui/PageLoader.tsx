"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface PageLoaderProps {
  title?: string;
  description?: string;
}

export default function PageLoader({
  title: _title,
  description: _description,
}: PageLoaderProps) {
  return (
    <div
      className="flex min-h-[calc(100dvh-5rem)] w-full items-center justify-center px-4 py-10"
      role="status"
      aria-label="Loading..."
    >
      <div className="flex flex-col items-center text-center">
        {/* Flight journey animation */}
        <div className="h-28 w-44 max-w-full" aria-hidden="true">
          <DotLottieReact
            src="/animations/flight-journey-loader.lottie"
            autoplay
            loop
            speed={3}
            className="h-full w-full"
          />
        </div>

        {/* Single loading message */}
        <p className="mt-2 text-sm font-medium tracking-tight text-[#e6e0e8]">
          Loading...
        </p>
      </div>
    </div>
  );
}