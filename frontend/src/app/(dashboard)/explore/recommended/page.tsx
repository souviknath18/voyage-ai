"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  History,
  Sparkles,
} from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";

import CuratedRecommendationCard from "@/components/explore/recommendations/CuratedRecommendationCard";
import RecommendationsHeader from "@/components/explore/recommendations/RecommendationsHeader";
import SimilarRecommendationCard from "@/components/explore/recommendations/SimilarRecommendationCard";
import ValueRecommendationList from "@/components/explore/recommendations/ValueRecommendationList";

import {
  Button,
} from "@/components/ui";

import type {
  AIRecommendation,
  SimilarRecommendation,
  ValueRecommendation,
} from "@/types/explore";

const curatedRecommendations: AIRecommendation[] = [
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
      "Matches your interest in coastal scenery, memorable food experiences and relaxed travel.",

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

    featured: true,
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
      "A strong match for scenic stays, architecture and slower evening experiences.",

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
];

const similarRecommendations: SimilarRecommendation[] = [
  {
    id:
      "similar-phuket",

    city:
      "Phuket",

    country:
      "Thailand",

    image:
      "/images/explore/phuket.jpg",

    description:
      "Tropical scenery, vibrant food culture and comfortable resort options with excellent value.",

    costLevel: 2,
  },

  {
    id:
      "similar-palawan",

    city:
      "Palawan",

    country:
      "Philippines",

    image:
      "/images/explore/palawan.jpg",

    description:
      "A quieter tropical escape with dramatic landscapes, clear water and outdoor adventures.",

    costLevel: 2,
  },
];

const valueRecommendations: ValueRecommendation[] = [
  {
    id:
      "value-lisbon",

    city:
      "Lisbon",

    country:
      "Portugal",

    image:
      "/images/explore/lisbon.jpg",

    description:
      "Excellent food and premium experiences at approachable prices.",

    region:
      "Europe",

    costLevel: 2,
  },

  {
    id:
      "value-cape-town",

    city:
      "Cape Town",

    country:
      "South Africa",

    image:
      "/images/explore/cape-town.jpg",

    description:
      "Scenery, wineries and quality stays with strong value.",

    region:
      "Africa",

    costLevel: 2,
  },

  {
    id:
      "value-bangkok",

    city:
      "Bangkok",

    country:
      "Thailand",

    image:
      "/images/explore/bangkok.jpg",

    description:
      "Outstanding food, culture and accommodation across many budgets.",

    region:
      "Asia",

    costLevel: 2,
  },
];

export default function AIRecommendationsPage() {
  const router =
    useRouter();

  const [
    savedIds,
    setSavedIds,
  ] = useState<
    string[]
  >([]);

  const handleSave = (
    id: string,
  ) => {
    setSavedIds(
      (previous) =>
        previous.includes(
          id,
        )
          ? previous.filter(
              (item) =>
                item !== id,
            )
          : [
              ...previous,
              id,
            ],
    );
  };

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-20 md:px-6">
        <div className="space-y-8">
          <RecommendationsHeader
            onBackAction={() =>
              router.push(
                "/explore",
              )
            }
          />

          {/* Curated */}
          <section>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={17}
                  className="text-[#fcd34d]"
                />

                <h2 className="text-base font-semibold text-[#e6e0e8] sm:text-lg">
                  Curated For You
                </h2>
              </div>

              <p className="mt-1 text-xs leading-5 text-[#948e9c]">
                VoyageAI&apos;s strongest destination matches based
                on your current travel profile.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {curatedRecommendations.map(
                (
                  recommendation,
                ) => (
                  <CuratedRecommendationCard
                    key={
                      recommendation.id
                    }
                    recommendation={
                      recommendation
                    }
                    saved={savedIds.includes(
                      recommendation.id,
                    )}
                    onSaveAction={
                      handleSave
                    }
                  />
                ),
              )}
            </div>
          </section>

          {/* Secondary */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <History
                    size={15}
                    className="text-[#d1bcff]"
                  />

                  <h2 className="text-base font-semibold text-[#e6e0e8]">
                    Based on Your Favorites
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {similarRecommendations.map(
                    (
                      recommendation,
                    ) => (
                      <SimilarRecommendationCard
                        key={
                          recommendation.id
                        }
                        recommendation={
                          recommendation
                        }
                      />
                    ),
                  )}
                </div>
              </section>

              {/* AI CTA */}
              <div className="relative overflow-hidden rounded-xl border border-[#fb7185]/20 bg-gradient-to-r from-[#2E1065]/50 to-[#151324] p-4 sm:p-5">
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#fcd34d]/[0.07] blur-3xl" />

                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-[#fcd34d]">
                    <Sparkles
                      size={17}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#e6e0e8]">
                      Want something more specific?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#948e9c]">
                      Tell VoyageAI what kind of experience you
                      want and generate a personalized trip.
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(
                        "/plan-trip",
                      )
                    }
                  >
                    Plan with VoyageAI

                    <ArrowRight
                      size={13}
                    />
                  </Button>
                </div>
              </div>
            </div>

            <ValueRecommendationList
              recommendations={
                valueRecommendations
              }
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}