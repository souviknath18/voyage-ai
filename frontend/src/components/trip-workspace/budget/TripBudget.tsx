"use client";

import type {
  BudgetRecommendation,
  TripBudgetCategory,
} from "@/types/trip-workspace";

import BudgetInsightCard from "./BudgetInsightCard";
import BudgetOptimizationCard from "./BudgetOptimizationCard";
import BudgetRecommendations from "./BudgetRecommendations";
import BudgetSourceCards from "./BudgetSourceCards";
import BudgetSummaryCard from "./BudgetSummaryCard";
import ExpenseBreakdown from "./ExpenseBreakdown";

interface TripBudgetProps {
  currency: string;

  totalBudget: number;

  estimatedCost: number;

  remainingBudget: number;

  potentialSavings: number;

  categories: TripBudgetCategory[];

  insight: string;

  recommendations:
    BudgetRecommendation[];
}

export default function TripBudget({
  currency,
  totalBudget,
  estimatedCost,
  remainingBudget,
  potentialSavings,
  categories,
  insight,
  recommendations,
}: TripBudgetProps) {
  const handleOptimize =
    () => {
      console.log(
        "Optimize complete budget",
      );
    };

  const handleApplyRecommendation =
    (
      recommendationId: string,
    ) => {
      console.log(
        "Apply budget recommendation:",
        recommendationId,
      );
    };

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <BudgetSummaryCard
            currency={
              currency
            }
            totalBudget={
              totalBudget
            }
            estimatedCost={
              estimatedCost
            }
            remainingBudget={
              remainingBudget
            }
          />
        </div>

        <div className="lg:col-span-4">
          <BudgetOptimizationCard
            currency={
              currency
            }
            potentialSavings={
              potentialSavings
            }
            recommendationCount={
              recommendations.length
            }
            onOptimizeAction={
              handleOptimize
            }
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ExpenseBreakdown
            categories={
              categories
            }
            currency={
              currency
            }
            estimatedCost={
              estimatedCost
            }
          />
        </div>

        <div className="space-y-3 lg:col-span-4">
          <BudgetSourceCards />

          <BudgetInsightCard
            insight={
              insight
            }
          />
        </div>
      </div>

      {/* Recommendations */}
      <BudgetRecommendations
        recommendations={
          recommendations
        }
        currency={
          currency
        }
        onApplyAction={
          handleApplyRecommendation
        }
      />
    </div>
  );
}