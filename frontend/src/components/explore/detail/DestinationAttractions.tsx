
import { Compass, MapPinned } from "lucide-react";

export default function DestinationAttractions() {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center gap-2">
        <Compass size={17} className="text-[#fb7185]" />

        <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
          Top Attractions
        </h2>
      </div>

      <div className="mt-5 flex min-h-[155px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#070B18]/40 px-5 py-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[#d1bcff]">
          <MapPinned size={19} />
        </div>

        <p className="mt-3 text-sm font-semibold text-[#e6e0e8]">
          Attractions coming soon
        </p>

        <p className="mt-1 max-w-sm text-xs leading-5 text-[#948e9c]">
          Curated, source-backed places will appear here when available.
        </p>
      </div>
    </section>
  );
}