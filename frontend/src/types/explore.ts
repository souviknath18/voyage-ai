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