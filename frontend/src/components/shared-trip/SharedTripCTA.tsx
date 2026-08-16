"use client";

import {
  Sparkles,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  Button,
} from "@/components/ui";

interface SharedTripCTAProps {
  shareId: string;
}

export default function SharedTripCTA({
  shareId,
}: SharedTripCTAProps) {
  const router =
    useRouter();

  return (
    <div className="rounded-xl border border-[#fb7185]/20 bg-gradient-to-br from-[#fb7185]/[0.06] to-[#d1bcff]/[0.04] p-5 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#fb7185] to-[#fcd34d] text-[#070B18]">
        <Sparkles size={17} />
      </div>

      <h3 className="mt-3 text-base font-semibold text-[#e6e0e8]">
        Inspired by this trip?
      </h3>

      <p className="mt-1.5 text-xs leading-5 text-[#948e9c]">
        Use this itinerary as inspiration and let VoyageAI customize it around your own preferences.
      </p>

      <Button
        fullWidth
        size="sm"
        className="mt-4"
        onClick={() =>
          router.push(
            `/plan-trip?template=${shareId}`,
          )
        }
      >
        <Sparkles size={13} />

        Create a Trip Like This
      </Button>
    </div>
  );
}