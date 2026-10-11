"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackToTripsButtonProps {
  className?: string;
}

export default function BackToTripsButton({
  className = "",
}: BackToTripsButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/trips")}
      className={`inline-flex w-fit items-center gap-2 text-xs font-medium text-[#a89cb5] transition-colors hover:text-white ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to My Trips
    </button>
  );
}