import {
  MapPin,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

interface TripHighlightsProps {
  highlights: string[];
}

export default function TripHighlights({
  highlights,
}: TripHighlightsProps) {
  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-base font-semibold text-[#e6e0e8]">
        Trip Highlights
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {highlights.map(
          (highlight) => (
            <div
              key={highlight}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <MapPin
                size={14}
                className="shrink-0 text-[#fb7185]"
              />

              <span className="text-xs text-[#cbc4d2]">
                {highlight}
              </span>
            </div>
          ),
        )}
      </div>
    </Card>
  );
}