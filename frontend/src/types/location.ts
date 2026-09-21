export interface LocationSuggestion {
  id: string;
  name: string;
  formattedName: string;
  city?: string;
  state?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  currency?: string;
}