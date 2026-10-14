
from app.integrations.flights.schemas import FlightOffer
from app.modules.flights.ranking import FlightCandidate
from app.modules.flights.refinement import refine_flights
from app.modules.flights.refinement_schemas import (
    FlightRefinementPreferences,
)
from app.modules.flights.schemas import (
  FlightOfferResponse,
  TripFlightsResponse,
)


def offer_to_candidate(
  offer: FlightOfferResponse,
) -> FlightCandidate:
  """
  Convert an API flight offer into the
  provider-independent ranking model.
  """

  offer_data = offer.model_dump(
    exclude={
      "converted_price",
      "converted_currency",
      "exchange_rate",
    }
  )

  normalized_offer = FlightOffer.model_validate(
    offer_data
  )

  return FlightCandidate(
    offer=normalized_offer,
    converted_price=offer.converted_price,
    converted_currency=offer.converted_currency,
    exchange_rate=offer.exchange_rate,
  )


def candidate_to_offer(
  candidate: FlightCandidate,
) -> FlightOfferResponse:
  """
  Convert a refined candidate back into
  the existing frontend-compatible schema.
  """

  return FlightOfferResponse.model_validate(
    {
      **candidate.offer.model_dump(),
      "converted_price": candidate.converted_price,
      "converted_currency": candidate.converted_currency,
      "exchange_rate": candidate.exchange_rate,
    }
  )


def refine_trip_flight_response(
  flights: TripFlightsResponse,
  preferences: FlightRefinementPreferences,
) -> TripFlightsResponse:
  """
  Refine existing flight offers while
  preserving the trip response metadata.
  """

  candidates = [
    offer_to_candidate(offer)
    for offer in flights.offers
  ]

  refined_candidates = refine_flights(
    candidates,
    preferences,
  )

  refined_offers = [
    candidate_to_offer(candidate)
    for candidate in refined_candidates
  ]

  return flights.model_copy(
    update={"offers": refined_offers}
  )