"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
} from "next/navigation";

import TripBudget from "@/components/trip-workspace/budget/TripBudget";

import {
  getTripBudget,
} from "@/lib/trips";

import type {
  TripBudget as TripBudgetData,
} from "@/lib/trips";

import {
  mockTrip,
} from "@/data/mock-trip";

import type {
  TripBudgetCategory,
} from "@/types/trip-workspace";


export default function TripBudgetPage() {
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
    other: "Other",
  };

  const categoryTypes = {
    food: "food",
    transport: "transport",
    activity: "activities",
    shopping: "shopping",
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

        source: "estimated",
      }),
    );

  return (
    <TripBudget
      currency={budget.currency}

      totalBudget={
        budget.total_budget !== null
          ? Number(
              budget.total_budget,
            )
          : 0
      }

      estimatedCost={Number(
        budget.estimated_cost,
      )}

      remainingBudget={
        budget.remaining_budget !== null
          ? Number(
              budget.remaining_budget,
            )
          : 0
      }

      categories={categories}

      potentialSavings={
        mockTrip.potentialSavings
      }

      insight={
        mockTrip.budgetInsight
      }

      recommendations={
        mockTrip.budgetRecommendations
      }
    />
  );
}