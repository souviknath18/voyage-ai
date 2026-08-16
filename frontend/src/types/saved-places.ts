export type SavedPlaceCategory =
  | "all"
  | "food"
  | "culture"
  | "technology"
  | "nature"
  | "adventure"
  | "nightlife";

export interface SavedPlace {
  id: string;

  name: string;

  city: string;
  country: string;

  description: string;

  image?: string;

  category: Exclude<
    SavedPlaceCategory,
    "all"
  >;

  categoryLabel: string;

  savedDate: string;

  rating?: number;
}