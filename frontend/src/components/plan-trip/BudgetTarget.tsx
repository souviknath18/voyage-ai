"use client";

import {
  Card,
  Input,
  Dropdown,
} from "@/components/ui";

import { WalletCards } from "lucide-react";

interface BudgetTargetProps {
  currency: string;
  budget: number;
  budgetLevel: number;

  onCurrencyChangeAction: (value: string) => void;
  onBudgetChangeAction: (value: number) => void;
  onBudgetLevelChangeAction: (value: number) => void;
}

export default function BudgetTarget({
  currency,
  budget,
  budgetLevel,
  onCurrencyChangeAction,
  onBudgetChangeAction,
  onBudgetLevelChangeAction,
}: BudgetTargetProps) {
  return (
    <Card className="p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <WalletCards
          size={18}
          className="shrink-0 text-[#fcd34d] sm:size-[19px]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
          Budget Target
        </h2>
      </div>

      {/* Budget Level */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-[#948e9c]">
          <span>Economy</span>
          <span>Luxury</span>
        </div>

        <input
          type="range"
          min={1}
          max={100}
          value={budgetLevel}
          onChange={(event) =>
            onBudgetLevelChangeAction(
              Number(event.target.value),
            )
          }
          className="h-1.5 w-full cursor-pointer accent-[#fb7185]"
        />
      </div>

      {/* Currency + Amount */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-[90px_1fr]">
        <Dropdown
          value={currency}
          onChangeAction={
            onCurrencyChangeAction
          }
          options={[
            {
              label: "INR",
              value: "INR",
            },
            {
              label: "USD",
              value: "USD",
            },
            {
              label: "EUR",
              value: "EUR",
            },
            {
              label: "GBP",
              value: "GBP",
            },
            {
              label: "JPY",
              value: "JPY",
            },
          ]}
        />

        <Input
          type="number"
          value={budget || ""}
          placeholder="Estimated amount"
          onChange={(event) =>
            onBudgetChangeAction(
              Number(event.target.value),
            )
          }
          className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
    </Card>
  );
}