export interface SharedTripActivity {
  id: string;

  time?: string;

  title: string;

  description: string;

  type:
    | "arrival"
    | "hotel"
    | "activity"
    | "food"
    | "transport";

  image?: string;

  status?: string;
}

export interface SharedTripDay {
  id: string;

  day: number;

  title: string;

  date?: string;

  activities:
    SharedTripActivity[];
}

export interface SharedTripHotel {
  name: string;

  location: string;

  image?: string;

  tags: string[];
}

export interface SharedTripData {
  shareId: string;

  title: string;

  destination: string;

  country: string;

  image?: string;

  startDate: string;
  endDate: string;

  duration: number;

  travelers: number;

  sharedBy: string;

  note?: string;

  days:
    SharedTripDay[];

  hotel:
    SharedTripHotel;
}