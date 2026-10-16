
import { Compass } from "lucide-react";

import type { ExploreDestinationApi } from "@/types/explore";

export default function DestinationOverview({
  destination,
}: {
  destination: ExploreDestinationApi;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center gap-2">
        <Compass size={17} className="text-[#fb7185]" />

        <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
          Destination Overview
        </h2>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#cbc4d2]">
        {destination.description?.trim() ||
          "A detailed destination overview is not available yet."}
      </p>
    </section>
  );
}