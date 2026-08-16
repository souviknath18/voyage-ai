import {
  BrainCircuit,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

interface TripAIOverviewProps {
  summary: string;
}

export default function TripAIOverview({
  summary,
}: TripAIOverviewProps) {
  return (
    <Card className="relative overflow-hidden p-4 sm:p-5">
      <div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-[#fb7185] via-[#fcd34d] to-transparent opacity-60" />

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#d1bcff]/20 bg-[#d1bcff]/10 text-[#d1bcff]">
          <BrainCircuit size={18} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-[#e6e0e8]">
            Why this plan fits you
          </h2>

          <p className="mt-1.5 text-sm leading-6 text-[#948e9c]">
            {summary}
          </p>
        </div>
      </div>
    </Card>
  );
}