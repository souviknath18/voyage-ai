import {
  Lightbulb,
} from "lucide-react";

import {
  Card,
} from "@/components/ui";

interface BudgetInsightCardProps {
  insight: string;
}

export default function BudgetInsightCard({
  insight,
}: BudgetInsightCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Lightbulb
          size={17}
          className="mt-0.5 shrink-0 text-[#fcd34d]"
        />

        <div>
          <h3 className="text-sm font-semibold text-[#e6e0e8]">
            VoyageAI Insight
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#948e9c]">
            {insight}
          </p>
        </div>
      </div>
    </Card>
  );
}