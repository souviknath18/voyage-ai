
import { ExternalLink, Image as ImageIcon } from "lucide-react";

import type { ExploreDestinationApi } from "@/types/explore";

export default function DestinationCredits({
  destination,
}: {
  destination: ExploreDestinationApi;
}) {
  if (
    !destination.image_artist &&
    !destination.image_page_url &&
    !destination.image_license
  ) {
    return null;
  }

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center gap-2">
        <ImageIcon size={16} className="text-[#fb7185]" />

        <h2 className="text-sm font-semibold text-[#e6e0e8]">
          Image Credits
        </h2>
      </div>

      <p className="mt-3 break-words text-xs leading-5 text-[#948e9c]">
        {destination.image_artist
          ? `Photo by ${destination.image_artist}`
          : "Destination image"}

        {destination.image_license
          ? ` · ${destination.image_license}`
          : ""}
      </p>

      <div className="mt-3 flex flex-wrap gap-4 text-xs">
        {destination.image_page_url && (
          <a
            href={destination.image_page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#d1bcff] hover:underline"
          >
            Image source
            <ExternalLink size={12} />
          </a>
        )}

        {destination.image_license_url && (
          <a
            href={destination.image_license_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#d1bcff] hover:underline"
          >
            License
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </section>
  );
}