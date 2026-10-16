"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getExploreDestinations } from "@/lib/api";
import { mapExploreDestinations } from "@/lib/explore-mapper";

import AppLayout from "@/components/layout/AppLayout";

import DestinationGrid from "@/components/explore/DestinationGrid";
import ExploreCategories from "@/components/explore/ExploreCategories";
import ExploreFilters from "@/components/explore/ExploreFilters";
import ExploreHeader from "@/components/explore/ExploreHeader";
import AIRecommendationsPreview from "@/components/explore/recommendations/AIRecommendationsPreview";

import type {
  AIRecommendation,
  Destination,
  ExploreCategory,
  ExploreFiltersData,
} from "@/types/explore";


const recommendationPreview: AIRecommendation[] = [
  {
    id:
      "recommendation-amalfi",

    city:
      "Amalfi Coast",

    country:
      "Italy",

    image:
      "/images/explore/amalfi.jpg",

    reason:
      "Matches your interest in coastal scenery and food experiences.",

    tags: [
      "Coastal",
      "Cuisine",
      "Photography",
    ],

    costLevel: 3,

    idealStay:
      "7 - 10 Days",

    bestTime:
      "May - Sep",

    matchScore: 96,
  },

  {
    id:
      "recommendation-santorini",

    city:
      "Santorini",

    country:
      "Greece",

    image:
      "/images/explore/santorini.jpg",

    reason:
      "Strong match for scenic stays and architecture.",

    tags: [
      "Views",
      "Architecture",
      "Romantic",
    ],

    costLevel: 3,

    idealStay:
      "5 - 7 Days",

    bestTime:
      "May - Sep",

    matchScore: 92,
  },

  {
    id:
      "recommendation-tokyo",

    city:
      "Tokyo",

    country:
      "Japan",

    image:
      "/images/explore/tokyo.jpg",

    reason:
      "Excellent match for technology, food and city photography.",

    tags: [
      "Technology",
      "Food",
      "Photography",
    ],

    costLevel: 3,

    idealStay:
      "10 - 14 Days",

    bestTime:
      "Mar - May",

    matchScore: 90,
  },

  {
    id:
      "recommendation-zermatt",

    city:
      "Zermatt",

    country:
      "Switzerland",

    image:
      "/images/explore/zermatt.jpg",

    reason:
      "Strong fit for mountain scenery and outdoor adventure.",

    tags: [
      "Mountains",
      "Adventure",
      "Nature",
    ],

    costLevel: 3,

    idealStay:
      "5 - 7 Days",

    bestTime:
      "Dec - Apr",

    matchScore: 87,
  },
];

export default function ExplorePage() {
  const [destinations, setDestinations] =
    useState<Destination[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [validationError, setValidationError] =
    useState<string | null>(null);

  const [
    activeCategory,
    setActiveCategory,
  ] =
    useState<ExploreCategory>(
      "popular",
    );

  const [
    filters,
    setFilters,
  ] =
    useState<ExploreFiltersData>({
      region: "",
      budgetStyle: "any",
      interest: "any",
      duration: "any",
    });

  const [appliedInterest, setAppliedInterest] =
    useState<string | null>(null);

  const [appliedRegion, setAppliedRegion] =
    useState("");

  const [discoverVersion, setDiscoverVersion] =
    useState(0);

  useEffect(() => {
    let cancelled = false;

    // Show loading when switching categories.
    setIsLoading(true);
    setLoadError(null);

    async function loadDestinations() {
      try {
        const response = await getExploreDestinations({
          limit: 100,
          offset: 0,
          category: activeCategory,
          interest: appliedInterest ?? undefined,
        });

        if (cancelled) return;

        setDestinations(
          mapExploreDestinations(response.items),
        );

        setLoadError(null);
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Failed to load Explore destinations:",
          error,
        );

        setLoadError(
          "Unable to load destinations. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDestinations();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, appliedInterest, discoverVersion]);

  const updateFilter = <
    K extends keyof ExploreFiltersData,
  >(
    key: K,
    value: ExploreFiltersData[K],
  ) => {
    setFilters(
      (previous) => ({
        ...previous,
        [key]: value,
      }),
    );
  };

  const handleGenerate = () => {
    const selectedInterest = filters.interest;

    if (filters.budgetStyle !== "any") {
      setValidationError(
        "Budget filtering is not available yet. Please select Any Budget.",
      );
      return;
    }

    if (filters.duration !== "any") {
      setValidationError(
        "Duration filtering is not available yet. Please select Any Duration.",
      );
      return;
    }

    setValidationError(null);

    setAppliedRegion(filters.region);

    setAppliedInterest(
      selectedInterest === "any"
        ? null
        : selectedInterest,
    );

    // Allow Discover to refresh results with unchanged filters.
    setDiscoverVersion((previous) => previous + 1);
  };

  const handleSave = (
    id: string,
  ) => {
    setDestinations(
      (previous) =>
        previous.map(
          (destination) =>
            destination.id ===
            id
              ? {
                  ...destination,
                  saved:
                    !destination.saved,
                }
              : destination,
        ),
    );
  };

  const visibleDestinations = useMemo(() => {
    let result = destinations;

    if (appliedRegion.trim()) {
      const query = appliedRegion
        .trim()
        .toLowerCase();

      result = result.filter(
        (destination) =>
          destination.city
            .toLowerCase()
            .includes(query) ||
          destination.country
            .toLowerCase()
            .includes(query),
      );
    }

    return result;
  }, [destinations, appliedRegion]);

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-6">
          <ExploreHeader />

          <ExploreFilters
            filters={filters}
            onChangeAction={
              updateFilter
            }
            onGenerateAction={
              handleGenerate
            }
          />

          {validationError && (
            <p
              role="alert"
              className="text-center text-sm text-rose-400"
            >
              {validationError}
            </p>
          )}

          <ExploreCategories
            activeCategory={
              activeCategory
            }
            onChangeAction={
              setActiveCategory
            }
          />

          {activeCategory ===
            "popular" &&
            !appliedRegion.trim() &&
            !appliedInterest && (
              <AIRecommendationsPreview
                recommendations={
                  recommendationPreview
                }
              />
            )}

          {isLoading ? (
            <p
              role="status"
              className="py-8 text-center text-sm text-[#cbc4d2]"
            >
              Loading destinations...
            </p>
          ) : loadError ? (
            <p
              role="alert"
              className="py-8 text-center text-sm text-rose-400"
            >
              {loadError}
            </p>
          ) : (
            <DestinationGrid
              destinations={visibleDestinations}
              onSaveAction={handleSave}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}