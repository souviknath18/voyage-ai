import {
  Sparkles,
} from "lucide-react";

interface HotelAIInsightProps {
  text: string;
}

export default function HotelAIInsight({
  text,
}: HotelAIInsightProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/[0.04] p-4">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#fcd34d]/[0.05] blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles
            size={15}
            className="text-[#fb7185]"
          />

          <h2 className="text-sm font-semibold text-[#e6e0e8]">
            VoyageAI Insight
          </h2>
        </div>

        <p className="mt-3 text-xs leading-5 text-[#948e9c]">
          {text}
        </p>
      </div>
    </div>
  );
}