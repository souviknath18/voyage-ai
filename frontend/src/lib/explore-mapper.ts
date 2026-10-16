import type {
  Destination,
  ExploreDestinationApi,
} from "@/types/explore";

export function mapExploreDestination(
  item: ExploreDestinationApi,
): Destination {
  return {
    id: item.wikidata_id,
    city: item.name,
    country: item.country,

    description:
      item.description ??
      "Discover this destination and start planning your journey.",

    image:
      item.image_url ?? "",
    category: undefined,
    tag: undefined,
    costLevel: undefined,
    idealStay: undefined,
    bestTime: undefined,

    featured: false,
    saved: false,

    // Preserve image attribution metadata.
    imageArtist: item.image_artist,
    imagePageUrl: item.image_page_url,
    imageLicense: item.image_license,
    imageLicenseUrl: item.image_license_url,
  };
}

export function mapExploreDestinations(
  items: ExploreDestinationApi[],
): Destination[] {
  return items.map(mapExploreDestination);
}