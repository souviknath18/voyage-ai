
import type {
  HotelComparisonOption,
} from "@/types/trip-workspace";

import type {
  HotelOffer,
  SelectedHotelResponse,
} from "@/lib/trips";

export function mapHotelOfferToOption(
  offer: HotelOffer,
  recommendedHotelId: string | null,
  selectedOfferId?: string | null,
): HotelComparisonOption {
  const highlights: string[] = [];

  if (offer.room.board_type) {
    highlights.push(offer.room.board_type);
  }

  if (offer.room.refundable === true) {
    highlights.push("Refundable booking");
  } else if (offer.room.refundable === false) {
    highlights.push("Non-refundable booking");
  }

  if (offer.within_hotel_budget === true) {
    highlights.push("Within hotel budget");
  }

  return {
    id: offer.id,
    name: offer.name,
    room: offer.room.name,
    location: offer.address || "Location unavailable",
    address: offer.address || undefined,
    image: offer.image_url || undefined,
    rating: Math.max(
      0,
      Math.min(5, Math.round((offer.star_rating ?? 0))),
    ),
    pricePerNight: Number(offer.converted_price_per_night),
    totalPrice: Number(offer.converted_price),
    nights: offer.nights,
    amenities: offer.amenities ?? [],
    highlights,
    label:
      offer.id === recommendedHotelId
        ? "recommended"
        : undefined,
    current: offer.id === selectedOfferId,
  };
}

export function mapSelectedHotelToOption(
  selected: SelectedHotelResponse,
): HotelComparisonOption {
  const option = mapHotelOfferToOption(
    selected.hotel_snapshot,
    null,
    selected.provider_offer_id,
  );

  return {
    ...option,
    current: true,
    totalPrice: Number(selected.converted_price),
  };
}