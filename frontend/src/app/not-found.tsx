"use client";

import {
  Compass,
  LayoutDashboard,
  SearchX,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Button,
} from "@/components/ui";

export default function NotFound() {
  const router =
    useRouter();

  const handleDashboard =
    () => {
      router.push(
        "/dashboard",
      );
    };

  const handleExplore =
    () => {
      router.push(
        "/explore",
      );
    };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#070B18] px-4 py-8">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-[#2e1065]/35 blur-[110px]" />

        <div className="absolute bottom-[10%] right-[10%] h-72 w-72 rounded-full bg-[#fb7185]/[0.08] blur-[110px]" />

        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]" />

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[680px] flex-col items-center text-center">
        {/* Visual */}
        <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.025] shadow-[0_0_45px_rgba(251,113,133,0.08)]" />

          {/* Inner Ring */}
          <div className="absolute inset-4 rounded-full border border-[#fb7185]/20 bg-[#fb7185]/[0.04]" />

          {/* Center Icon */}
          <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#0D1324] text-[#fb7185] shadow-[0_12px_30px_rgba(0,0,0,0.3)] sm:h-16 sm:w-16">
            <SearchX
              size={28}
              className="sm:size-[30px]"
            />
          </div>
        </div>

        {/* 404 */}
        <p className="mt-4 bg-gradient-to-r from-[#fb7185] to-[#fcd34d] bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
          404
        </p>

        {/* Heading */}
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
          We couldn&apos;t find this destination
        </h1>

        {/* Description */}
        <p className="mx-auto mt-2 max-w-[500px] text-sm leading-6 text-[#948e9c]">
          The page, trip, place or shared journey you&apos;re looking for may have moved, expired or no longer exists.
        </p>

        {/* Actions */}
        <div className="mt-7 flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button
            fullWidth
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

          <Button
            fullWidth
            variant="outline"
            size="md"
            onClick={
              handleExplore
            }
            className="sm:w-auto"
          >
            <Compass
              size={15}
            />

            Explore Destinations
          </Button>
        </div>

        {/* Helper */}
        <p className="mt-5 text-xs text-[#7f8798]">
          VoyageAI can help you get back on route.
        </p>
      </div>
    </main>
  );
}