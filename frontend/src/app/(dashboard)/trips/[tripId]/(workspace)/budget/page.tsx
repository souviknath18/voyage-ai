import TripBudget from "@/components/trip-workspace/budget/TripBudget";

import { mockTrip } from "@/data/mock-trip";

export default function TripBudgetPage() {
  const trip =
    mockTrip;

  return (
    <TripBudget
      currency={
        trip.currency
      }
      totalBudget={
        trip.totalBudget
      }
      estimatedCost={
        trip.estimatedCost
      }
      remainingBudget={
        trip.remainingBudget
      }
      potentialSavings={
        trip.potentialSavings
      }
      categories={
        trip.budgetCategories
      }
      insight={
        trip.budgetInsight
      }
      recommendations={
        trip.budgetRecommendations
      }
    />
  );
}