import type { LocationSuggestion } from "@/types/location";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


interface LocationSearchResponse {
  id: string;
  name: string | null;
  admin1: string | null;
  country: string | null;
  country_code: string | null;
  latitude: number;
  longitude: number;
  timezone: string | null;
  formatted_name: string;
}


export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<LocationSuggestion[]> {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return [];
  }

  const response = await fetch(
    `${API_URL}/locations/search?query=${encodeURIComponent(trimmedQuery)}`,
    {
      signal,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to search locations");
  }

  const data: LocationSearchResponse[] =
    await response.json();

  return data.map((location) => ({
    id: location.id,
    name: location.name ?? location.formatted_name,
    formattedName: location.formatted_name,
    city: location.name ?? undefined,
    state: location.admin1 ?? undefined,
    country: location.country ?? "",
    countryCode: location.country_code ?? "",
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone ?? undefined,
  }));
}