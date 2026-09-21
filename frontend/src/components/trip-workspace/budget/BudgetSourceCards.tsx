import {
  BrainCircuit,
  Radio,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

export default function BudgetSourceCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {/* Provider pricing */}
      <Card className="border-l-4 border-l-[#d1bcff] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#d1bcff]/10 text-[#d1bcff]">
            <Radio
              size={18}
              className="animate-pulse"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#e6e0e8]">
              Live Provider Prices
            </h3>

            <p className="mt-1 text-xs text-[#948e9c]">
              Live flight and hotel pricing will be shown here when provider integrations are available.
            </p>
          </div>
        </div>
      </Card>

      {/* Estimated */}
      <Card className="border-l-4 border-l-[#fb7185] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fb7185]/10 text-[#fb7185]">
            <BrainCircuit size={18} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#e6e0e8]">
              AI Estimated Costs
            </h3>

            <p className="mt-1 text-xs text-[#948e9c]">
              Current itinerary costs are AI-generated estimates for food, activities, local transport, shopping and other expenses.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}