export type ExploreCategory =
  | "popular"
  | "culinary"
  | "adventure"
  | "beaches"
  | "culture"
  | "technology";

export interface ExploreFiltersData {
  region: string;
  budgetStyle: string;
  interest: string;
  duration: string;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  description: string;
  image: string;

  category: ExploreCategory;

  tag: string;

  costLevel: number;

  idealStay: string;

  bestTime: string;

  featured?: boolean;
  saved?: boolean;
}

export interface AIRecommendation {
  id: string;

  city: string;
  country: string;

  image?: string;

  reason: string;

  tags: string[];

  costLevel: number;

  idealStay: string;

  bestTime: string;

  matchScore?: number;

  featured?: boolean;
}

export interface SimilarRecommendation {
  id: string;

  city: string;
  country: string;

  image?: string;

  description: string;

  costLevel: number;
}

export interface ValueRecommendation {
  id: string;

  city: string;
  country: string;

  image?: string;

  description: string;

  region: string;

  costLevel: number;
}