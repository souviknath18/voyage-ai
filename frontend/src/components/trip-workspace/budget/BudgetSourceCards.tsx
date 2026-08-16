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
      {/* Live */}
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
              Flights and hotels use current provider pricing when available.
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
              AI Estimated Allowances
            </h3>

            <p className="mt-1 text-xs text-[#948e9c]">
              Food, local transport and flexible spending can use AI-generated estimates.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}