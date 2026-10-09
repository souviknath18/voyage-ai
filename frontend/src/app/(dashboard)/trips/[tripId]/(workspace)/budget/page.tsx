"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import TripBudget from "@/components/trip-workspace/budget/TripBudget";

import {
  getTripBudget,
  optimizeTrip,
} from "@/lib/trips";

import type {
  TripBudget as TripBudgetData,
} from "@/lib/trips";

import type {
  BudgetRecommendation,
  TripBudgetCategory,
} from "@/types/trip-workspace";


export default function TripBudgetPage() {
  const router = useRouter();
  const params = useParams<{
    tripId: string;
  }>();

  const tripId =
    params.tripId;

  const [
    budget,
    setBudget,
  ] = useState<TripBudgetData | null>(
    null,
  );

  const [
    optimizing,
    setOptimizing,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadBudget() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getTripBudget(
            tripId,
          );

        if (!cancelled) {
          setBudget(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load budget",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (tripId) {
      loadBudget();
    }

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  if (loading) {
    return (
      <div className="py-10 text-sm text-[#948e9c]">
        Loading budget...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="py-10 text-sm text-[#948e9c]">
        Budget data is not available.
      </div>
    );
  }

  const categoryLabels = {
    food: "Food",
    transport: "Transport",
    activity: "Activities",
    shopping: "Shopping",
    accommodation: "Accommodation",
    flight: "Flights",
    other: "Other",
  };

  const categoryTypes = {
    food: "food",
    transport: "transport",
    activity: "activities",
    shopping: "shopping",
    accommodation: "hotel",
    flight: "flight",
    other: "buffer",
  } as const;

  const categories: TripBudgetCategory[] =
    budget.categories.map(
      (category) => ({
        id: category.category,

        label:
          categoryLabels[
            category.category
          ],

        type:
          categoryTypes[
            category.category
          ],

        amount: Number(
          category.estimated_cost,
        ),

        source:
          category.category === "accommodation" ||
          category.category === "flight"
            ? "live"
            : "estimated",
      }),
    );

  const recommendations: BudgetRecommendation[] =
    budget.recommendations.map(
      (
        recommendation,
        index,
      ) => ({
        id: `budget-recommendation-${index}`,

        title:
          recommendation.title,

        description:
          recommendation.description,

        savings: Number(
          recommendation.estimated_savings,
        ),

        type:
          recommendation.category ===
          "activity"
            ? "activity"
            : recommendation.category ===
                "food"
              ? "food"
              : recommendation.category ===
                  "transport"
                ? "transport"
                : "activity",
      }),
    );

  const handleOptimizeBudget =
    async () => {
      if (optimizing) {
        return;
      }

      try {
        setOptimizing(true);
        setError(null);

        const run =
          await optimizeTrip(
            tripId,
            {
              optimization_type:
                "cheaper",

              instructions:
                "Reduce the trip cost while preserving the core itinerary experience. Prioritize the budget optimization opportunities identified in the current itinerary.",
            },
          );

        router.push(
          `/planning/${run.id}`,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to start budget optimization",
        );

        setOptimizing(false);
      }
    };

  return (
    <TripBudget
      currency={budget.currency}
      totalBudget={
        budget.total_budget !== null
          ? Number(budget.total_budget)
          : 0
      }
      estimatedCost={Number(
        budget.estimated_cost,
      )}
      remainingBudget={
        budget.remaining_budget !== null
          ? Number(budget.remaining_budget)
          : 0
      }
      categories={categories}
      potentialSavings={Number(
        budget.potential_savings.amount,
      )}
      insight={
        `${budget.insight.title}. ${budget.insight.description}`
      }
      recommendations={recommendations}
      onOptimizeAction={
        handleOptimizeBudget
      }
    />
  );
}