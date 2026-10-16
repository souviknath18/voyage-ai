"use client";

import { useEffect } from "react";

import ErrorState from "@/components/ui/ErrorState";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error(
      "Application error:",
      error,
    );
  }, [error]);

  return (
    <ErrorState
      onRetry={reset}
      fullScreen
    />
  );
}