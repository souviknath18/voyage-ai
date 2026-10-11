import type { SavedTripPlace } from "@/lib/trips";
import type {
  SavedPlace,
  SavedPlaceCategory,
} from "@/types/saved-places";

type PlaceCategory = Exclude<SavedPlaceCategory, "all">;

function getCategory(
  place: SavedTripPlace,
): PlaceCategory {
  const values = [
    place.search_group ?? "",
    ...place.categories,
  ].join(" ").toLowerCase();

  if (/restaurant|catering|food|cafe/.test(values)) {
    return "food";
  }

  if (/nightlife|nightclub|bar|pub/.test(values)) {
    return "nightlife";
  }

  if (/nature|natural|park|forest|garden/.test(values)) {
    return "nature";
  }

  if (/sport|adventure|hiking|mountain/.test(values)) {
    return "adventure";
  }

  if (/technology|science/.test(values)) {
    return "technology";
  }

  return "culture";
}

export function mapSavedTripPlace(
  place: SavedTripPlace,
): SavedPlace {
  const category = getCategory(place);

  const labels: Record<PlaceCategory, string> = {
    food: "Food",
    culture: "Culture",
    technology: "Technology",
    nature: "Nature",
    adventure: "Adventure",
    nightlife: "Nightlife",
  };

  return {
    id: place.id,
    tripId: place.trip_id,
    name: place.name,
    city: place.destination_name || place.destination,
    country: place.destination_country || "",
    description:
      place.address ||
      "Saved attraction from your VoyageAI trip.",
    category,
    categoryLabel: labels[category],
    savedDate: "",
  };
}