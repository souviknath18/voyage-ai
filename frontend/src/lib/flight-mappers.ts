import type {
  FlightOffer,
  FlightSegment,
  FlightSlice,
  SelectedFlightResponse,
} from "@/lib/trips";

import type {
  FlightComparisonOption,
  FlightSegmentOption,
  FlightSliceOption,
  TripFlight,
} from "@/types/trip-workspace";

function formatTime(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).format(new Date(value));
}

function formatDuration(
  duration: string,
): string {
  const days =
    duration.match(/(\d+)D/)?.[1];

  const hours =
    duration.match(/(\d+)H/)?.[1];

  const minutes =
    duration.match(/(\d+)M/)?.[1];

  const parts: string[] = [];

  if (days) {
    parts.push(`${days}d`);
  }

  if (hours) {
    parts.push(`${hours}h`);
  }

  if (minutes) {
    parts.push(`${minutes}m`);
  }

  return parts.join(" ");
}

function mapSegment(
  segment: FlightSegment,
): FlightSegmentOption {
  return {
    airline: segment.airline,

    airlineCode:
      segment.airline_code ??
      undefined,

    flightNumber:
      segment.flight_number,

    from: segment.origin,
    to: segment.destination,

    departureAt:
      segment.departure_at,

    arrivalAt:
      segment.arrival_at,

    duration:
      segment.duration
        ? formatDuration(
            segment.duration,
          )
        : undefined,

    cabin:
      segment.cabin ??
      undefined,
  };
}

function mapSlice(
  slice: FlightSlice,
): FlightSliceOption {
  return {
    from: slice.origin,
    to: slice.destination,

    departureAt:
      slice.departure_at,

    arrivalAt:
      slice.arrival_at,

    duration:
      formatDuration(
        slice.duration,
      ),

    stops: slice.stops,

    stopDescription:
      slice.stop_description,

    segments:
      slice.segments.map(
        mapSegment,
      ),
  };
}

export function mapFlightOffer(
  offer: FlightOffer,
): FlightComparisonOption {
  const firstSegment =
    offer.outbound.segments[0];

  return {
    id: offer.id,

    airline: offer.airline,

    airlineCode:
      offer.airline_code ??
      undefined,

    flightNumber:
      firstSegment?.flight_number ??
      offer.airline_code ??
      "",

    from: offer.outbound.origin,

    to: offer.outbound.destination,

    departureTime:
      formatTime(
        offer.outbound
          .departure_at,
      ),

    arrivalTime:
      formatTime(
        offer.outbound
          .arrival_at,
      ),

    duration:
      formatDuration(
        offer.outbound.duration,
      ),

    stops:
      offer.outbound.stops,

    stopDescription:
      offer.outbound
        .stop_description,

    cabin:
      firstSegment?.cabin ??
      "Economy",

    baggage:
      offer.baggage ??
      undefined,

    wifi:
      offer.wifi ??
      undefined,

    price:
      Number(offer.price),

    currency:
      offer.currency,

    convertedPrice:
      Number(
        offer.converted_price,
      ),

    convertedCurrency:
      offer.converted_currency,

    exchangeRate:
      Number(
        offer.exchange_rate,
      ),

    outboundSegments:
      offer.outbound.segments.map(
        mapSegment,
      ),

    returnFlight:
      offer.return_flight
        ? mapSlice(
            offer.return_flight,
          )
        : undefined,
  };
}


function formatFlightDateTime(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).format(
    new Date(value),
  );
}


function buildRoute(
  slice: FlightSlice,
): string {
  if (
    slice.segments.length === 0
  ) {
    return `${slice.origin} → ${slice.destination}`;
  }

  const airports = [
    slice.segments[0].origin,

    ...slice.segments.map(
      (segment) =>
        segment.destination,
    ),
  ];

  return airports.join(" → ");
}


export function mapSelectedFlightToTripFlights(
  selected: SelectedFlightResponse,
): TripFlight[] {
  const flights: TripFlight[] = [];

  const outboundFirstSegment =
    selected.outbound.segments[0];

  flights.push({
    id: `${selected.id}-outbound`,

    type: "departure",

    airline:
      selected.airline,

    flightNumber:
      outboundFirstSegment
        ?.flight_number ??
      selected.airline_code ??
      "",

    from:
      selected.outbound.origin,

    to:
      selected.outbound.destination,

    departureTime:
      formatFlightDateTime(
        selected.outbound
          .departure_at,
      ),

    route:
      buildRoute(
        selected.outbound,
      ),

    cabin:
      outboundFirstSegment
        ?.cabin ??
      "Economy",

    price:
      Number(
        selected.converted_price,
      ),
  });

  if (selected.return_flight) {
    const returnFirstSegment =
      selected.return_flight
        .segments[0];

    flights.push({
      id: `${selected.id}-return`,

      type: "return",

      airline:
        returnFirstSegment
          ?.airline ??
        selected.airline,

      flightNumber:
        returnFirstSegment
          ?.flight_number ??
        selected.airline_code ??
        "",

      from:
        selected.return_flight
          .origin,

      to:
        selected.return_flight
          .destination,

      departureTime:
        formatFlightDateTime(
          selected.return_flight
            .departure_at,
        ),

      route:
        buildRoute(
          selected.return_flight,
        ),

      cabin:
        returnFirstSegment
          ?.cabin ??
        "Economy",

      price: 0,
    });
  }

  return flights;
}


export function mapSelectedFlightToComparisonOption(
  selected: SelectedFlightResponse,
): FlightComparisonOption {
  const firstSegment =
    selected.outbound.segments[0];

  return {
    id:
      selected.provider_offer_id,

    airline:
      selected.airline,

    airlineCode:
      selected.airline_code ??
      undefined,

    flightNumber:
      firstSegment
        ?.flight_number ??
      selected.airline_code ??
      "",

    from:
      selected.outbound.origin,

    to:
      selected.outbound.destination,

    departureTime:
      formatTime(
        selected.outbound
          .departure_at,
      ),

    arrivalTime:
      formatTime(
        selected.outbound
          .arrival_at,
      ),

    duration:
      formatDuration(
        selected.outbound.duration,
      ),

    stops:
      selected.outbound.stops,

    stopDescription:
      selected.outbound
        .stop_description,

    cabin:
      firstSegment?.cabin ??
      "Economy",

    baggage:
      selected.baggage ??
      undefined,

    price:
      Number(
        selected.original_price,
      ),

    currency:
      selected.original_currency,

    convertedPrice:
      Number(
        selected.converted_price,
      ),

    convertedCurrency:
      selected.converted_currency,

    exchangeRate:
      Number(
        selected.exchange_rate,
      ),

    outboundSegments:
      selected.outbound.segments.map(
        mapSegment,
      ),

    returnFlight:
      selected.return_flight
        ? mapSlice(
            selected.return_flight,
          )
        : undefined,

    current: true,
    persistedSnapshot: true,
  };
}


function parseDurationMinutes(
  duration: string,
): number {
  const dayMatch =
    duration.match(/(\d+)d/);

  const hourMatch =
    duration.match(/(\d+)h/);

  const minuteMatch =
    duration.match(/(\d+)m/);

  const days = dayMatch
    ? Number(dayMatch[1])
    : 0;

  const hours = hourMatch
    ? Number(hourMatch[1])
    : 0;

  const minutes = minuteMatch
    ? Number(minuteMatch[1])
    : 0;

  return (
    days * 24 * 60 +
    hours * 60 +
    minutes
  );
}

function getFlightDurationMinutes(
  flight: FlightComparisonOption,
): number {
  return parseDurationMinutes(
    flight.duration,
  );
}

function getComparablePrice(
  flight: FlightComparisonOption,
): number {
  return (
    flight.convertedPrice ??
    flight.price
  );
}

export function shortlistFlights(
  offers: FlightOffer[],
  limit = 6,
): FlightComparisonOption[] {
  if (offers.length === 0) {
    return [];
  }

  const flights =
    offers.map(mapFlightOffer);

  const cheapest = [...flights].sort(
    (a, b) =>
      getComparablePrice(a) -
      getComparablePrice(b),
  )[0];

  const fastest = [...flights].sort(
    (a, b) =>
      getFlightDurationMinutes(a) -
      getFlightDurationMinutes(b),
  )[0];

  const prices =
    flights.map(
      getComparablePrice,
    );

  const durations =
    flights.map(
      getFlightDurationMinutes,
    );

  const minPrice =
    Math.min(...prices);

  const maxPrice =
    Math.max(...prices);

  const minDuration =
    Math.min(...durations);

  const maxDuration =
    Math.max(...durations);

  const normalize = (
    value: number,
    min: number,
    max: number,
  ) => {
    if (max === min) {
      return 0;
    }

    return (
      (value - min) /
      (max - min)
    );
  };

  const ranked = flights
    .map((flight) => {
      const duration =
        getFlightDurationMinutes(
          flight,
        );

      const priceScore =
        normalize(
          getComparablePrice(
            flight,
          ),
          minPrice,
          maxPrice,
        );

      const durationScore =
        normalize(
          duration,
          minDuration,
          maxDuration,
        );

      const stopScore =
        Math.min(
          flight.stops / 2,
          1,
        );

      /*
       * Lower score is better.
       *
       * Price:    50%
       * Duration: 35%
       * Stops:    15%
       */
      const score =
        priceScore * 0.5 +
        durationScore * 0.35 +
        stopScore * 0.15;

      return {
        flight,
        score,
      };
    })
    .sort(
      (a, b) =>
        a.score - b.score,
    );

  const recommended =
    ranked[0].flight;

  const selected =
    new Map<
      string,
      FlightComparisonOption
    >();

  const addFlight = (
    flight:
      | FlightComparisonOption
      | undefined,
    label?:
      | "recommended"
      | "cheapest"
      | "fastest",
  ) => {
    if (!flight) {
      return;
    }

    const existing =
      selected.get(flight.id);

    if (existing) {
      return;
    }

    selected.set(
      flight.id,
      {
        ...flight,
        label,
      },
    );
  };

  addFlight(
    recommended,
    "recommended",
  );

  addFlight(
    cheapest,
    "cheapest",
  );

  addFlight(
    fastest,
    "fastest",
  );

  for (const item of ranked) {
    if (
      selected.size >= limit
    ) {
      break;
    }

    addFlight(item.flight);
  }

  return Array.from(
    selected.values(),
  );
}