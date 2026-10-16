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
  category?: ExploreCategory;
  tag?: string;
  costLevel?: number;
  idealStay?: string;
  bestTime?: string;
  imageArtist?: string | null;
  imagePageUrl?: string | null;
  imageLicense?: string | null;
  imageLicenseUrl?: string | null;
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

export interface ExploreDestinationApi {
  id: string;
  wikidata_id: string;

  name: string;
  country: string;
  country_code: string;

  latitude: number;
  longitude: number;

  source: string;
  country_source: string;

  description: string | null;
  description_source: string | null;

  image_url: string | null;
  image_source: string | null;

  image_artist: string | null;
  image_page_url: string | null;
  image_license: string | null;
  image_license_url: string | null;

  created_at: string;
  updated_at: string;
}

export interface ExploreDestinationListApi {
  items: ExploreDestinationApi[];
  total: number;
  limit: number;
  offset: number;
}