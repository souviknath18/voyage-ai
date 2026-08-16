"use client";

import {
  ChevronRight,
  MapPin,
  Navigation,
} from "lucide-react";

interface PlaceMapCardProps {
  location: string;

  onOpenMapAction?: () => void;
}

export default function PlaceMapCard({
  location,
  onOpenMapAction,
}: PlaceMapCardProps) {
  return (
    <button
      type="button"
      onClick={
        onOpenMapAction
      }
      className="group w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-left"
    >
      {/* Map */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#101728] via-[#0A1020] to-[#171126]">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <span className="absolute h-12 w-12 animate-ping rounded-full bg-[#fb7185]/20" />

          <MapPin
            size={31}
            fill="currentColor"
            className="relative text-[#fb7185]"
          />
        </div>

        <div className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-[#070B18]/70 px-3 py-2 backdrop-blur-xl">
          <p className="text-[10px] font-medium text-[#cbc4d2]">
            {location}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Navigation
            size={14}
            className="text-[#fcd34d]"
          />

          <span className="text-xs text-[#cbc4d2]">
            View location & route
          </span>
        </div>

        <ChevronRight
          size={15}
          className="text-[#7f8798] transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </button>
  );
}