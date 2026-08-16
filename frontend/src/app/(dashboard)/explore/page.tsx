"use client";

import {
  useMemo,
  useState,
} from "react";

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

const initialDestinations: Destination[] = [
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",

    description:
      "Ancient traditions meet neon-lit neighborhoods, world-class food and futuristic city life.",

    image:
      "/images/explore/tokyo.jpg",

    category:
      "technology",

    tag:
      "Tech & Culture",

    costLevel: 3,

    idealStay:
      "10 - 14 Days",

    bestTime:
      "Mar - May",

    featured: true,

    saved: false,
  },

  {
    id: "santorini",
    city:
      "Santorini",
    country:
      "Greece",

    description:
      "Whitewashed villages, volcanic cliffs and unforgettable sunsets over the Aegean Sea.",

    image:
      "/images/explore/santorini.jpg",

    category:
      "beaches",

    tag:
      "Romantic Retreat",

    costLevel: 3,

    idealStay:
      "4 - 6 Days",

    bestTime:
      "May - Sep",

    saved: false,
  },

  {
    id: "zermatt",
    city:
      "Zermatt",
    country:
      "Switzerland",

    description:
      "High-altitude Alpine scenery, mountain adventures and peaceful luxury beneath the Matterhorn.",

    image:
      "/images/explore/zermatt.jpg",

    category:
      "adventure",

    tag:
      "Mountain Adventure",

    costLevel: 3,

    idealStay:
      "5 - 7 Days",

    bestTime:
      "Dec - Apr",

    saved: false,
  },

  {
    id: "monteverde",
    city:
      "Monteverde",
    country:
      "Costa Rica",

    description:
      "Cloud forests, rare wildlife and immersive nature experiences surrounded by incredible biodiversity.",

    image:
      "/images/explore/monteverde.jpg",

    category:
      "adventure",

    tag:
      "Eco Adventure",

    costLevel: 2,

    idealStay:
      "5 - 7 Days",

    bestTime:
      "Dec - Apr",

    saved: false,
  },

  {
    id: "marrakech",
    city:
      "Marrakech",
    country:
      "Morocco",

    description:
      "Historic riads, vibrant markets, traditional cuisine and rich North African culture.",

    image:
      "/images/explore/marrakech.jpg",

    category:
      "culture",

    tag:
      "Culture & Food",

    costLevel: 2,

    idealStay:
      "4 - 6 Days",

    bestTime:
      "Mar - May",

    saved: false,
  },

  {
    id: "amalfi",
    city:
      "Amalfi Coast",
    country:
      "Italy",

    description:
      "Cliffside towns, Mediterranean waters and unforgettable coastal Italian cuisine.",

    image:
      "/images/explore/amalfi.jpg",

    category:
      "culinary",

    tag:
      "Coast & Cuisine",

    costLevel: 3,

    idealStay:
      "5 - 7 Days",

    bestTime:
      "May - Sep",

    saved: false,
  },
];

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
  const [
    destinations,
    setDestinations,
  ] =
    useState<Destination[]>(
      initialDestinations,
    );

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

  const handleGenerate =
    () => {
      console.log(
        "Explore filters:",
        filters,
      );

      /*
       * Later:
       *
       * Send these filters
       * to FastAPI / VoyageAI agent.
       */
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

  const visibleDestinations =
    useMemo(() => {
      let result =
        destinations;

      if (
        activeCategory !==
        "popular"
      ) {
        result =
          result.filter(
            (destination) =>
              destination.category ===
              activeCategory,
          );
      }

      if (
        filters.region.trim()
      ) {
        const query =
          filters.region
            .trim()
            .toLowerCase();

        result =
          result.filter(
            (destination) =>
              destination.city
                .toLowerCase()
                .includes(
                  query,
                ) ||
              destination.country
                .toLowerCase()
                .includes(
                  query,
                ),
          );
      }

      return result;
    }, [
      destinations,
      activeCategory,
      filters.region,
    ]);

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
            !filters.region.trim() && (
              <AIRecommendationsPreview
                recommendations={
                  recommendationPreview
                }
              />
            )}

          <DestinationGrid
            destinations={
              visibleDestinations
            }
            onSaveAction={
              handleSave
            }
          />
        </div>
      </div>
    </AppLayout>
  );
}