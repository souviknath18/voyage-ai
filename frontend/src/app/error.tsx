"use client";

import {
  Info,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Button,
} from "@/components/ui";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  const router =
    useRouter();

  /*
   * Keep the actual error available
   * for development/logging without
   * exposing technical details in UI.
   */
  useEffect(() => {
    console.error(
      "VoyageAI application error:",
      error,
    );
  }, [error]);

  const handleDashboard =
    () => {
      router.push(
        "/dashboard",
      );
    };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#070B18] px-4 py-8">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-[#2e1065]/30 blur-[110px]" />

        <div className="absolute bottom-[10%] right-[10%] h-72 w-72 rounded-full bg-[#fb7185]/[0.07] blur-[110px]" />

        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />
      </div>

      {/* Recovery Card */}
      <section className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center shadow-[0_24px_70px_rgba(0,0,0,0.4)] sm:p-7">
        {/* Accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#fb7185] to-transparent opacity-70" />

        {/* Icon */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#fb7185]/10 blur-xl" />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#fb7185]/25 bg-[#fb7185]/10 text-[#fb7185] shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
            <RefreshCw
              size={23}
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
          Something interrupted your journey
        </h1>

        {/* Description */}
        <p className="mx-auto mt-2 max-w-[430px] text-sm leading-6 text-[#948e9c]">
          We couldn&apos;t complete this request, but your saved trips and preferences are safe.
        </p>

        <p className="mt-2 text-xs font-medium text-[#fb7185]/80">
          This may be temporary.
        </p>

        {/* Recovery Status */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3.5 text-left">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#fcd34d]/20 bg-[#fcd34d]/10 text-[#fcd34d]">
            <Info
              size={14}
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#e6e0e8]">
              Recovery Status
            </p>

            <p className="mt-1 text-xs leading-5 text-[#948e9c]">
              VoyageAI can safely retry this page without losing saved data.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button
            fullWidth
            size="md"
            onClick={
              reset
            }
            className="sm:w-auto"
          >
            <RefreshCw
              size={15}
            />

            Try Again
          </Button>

          <Button
            fullWidth
            variant="outline"
            size="md"
            onClick={
              handleDashboard
            }
            className="sm:w-auto"
          >
            <LayoutDashboard
              size={15}
            />

            Return to Dashboard
          </Button>
        </div>
      </section>
    </main>
  );
}