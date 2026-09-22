import type {
  TripWorkspaceData,
} from "@/types/trip-workspace";

export const mockTrip: TripWorkspaceData = {
  id: "tokyo-001",

  title: "Tokyo Technology & Food Escape",

  origin: "Bangalore",
  destination: "Tokyo",

  originCode: "BLR",
  destinationCode: "NRT",

  startDate: "10 Nov 2026",
  endDate: "15 Nov 2026",

  duration: 6,

  travelers: 1,

  status: "ready",

  currency: "INR",

  totalBudget: 150000,
  estimatedCost: 143800,
  remainingBudget: 6200,

  image: "/images/explore/tokyo.jpg",

  aiSummary:
    "VoyageAI balanced your interests in technology, Japanese food and photography with a moderate travel pace. Attractions are grouped geographically to reduce unnecessary transit, while the selected hotel keeps you well connected to Shinjuku, Shibuya and central Tokyo.",

  warning: {
    title: "Possible itinerary conflict",

    description:
      "The Shibuya Sky reservation overlaps slightly with your evening dinner window on Day 3.",
  },

  // =========================================================
  // FLIGHTS
  // =========================================================

  flights: [
    {
      id: "flight-out",

      type: "departure",

      airline: "ANA",
      flightNumber: "NH838",

      from: "BLR",
      to: "NRT",

      departureTime: "10 Nov • 20:15",

      route: "BLR → SIN → NRT",

      cabin: "Economy",

      price: 48900,
    },

    {
      id: "flight-return",

      type: "return",

      airline: "Singapore Airlines",
      flightNumber: "SQ635",

      from: "NRT",
      to: "BLR",

      departureTime: "15 Nov • 17:30",

      route: "NRT → SIN → BLR",

      cabin: "Economy",

      price: 0,
    },
  ],

  // =========================================================
  // HOTEL
  // =========================================================

  hotel: {
    id: "hotel-001",

    name: "Shinjuku Granbell Hotel",

    room: "Superior Double Room",

    address: "Kabukicho, Shinjuku City, Tokyo",

    image: "/images/hotels/shinjuku.jpg",

    rating: 4,

    pricePerNight: 8400,

    nights: 5,
  },

  // =========================================================
  // WEATHER
  // =========================================================

  weather: {
    temperature: 18,

    condition: "Mostly Clear",

    note:
      "Good conditions for walking and outdoor sightseeing.",
  },

  // =========================================================
  // HIGHLIGHTS
  // =========================================================

  highlights: [
    "Shibuya Sky",
    "teamLab Borderless",
    "Meiji Shrine",
    "Akihabara",
    "Tokyo Skytree",
    "Tsukiji Outer Market",
  ],

  // =========================================================
  // OVERVIEW BUDGET BREAKDOWN
  // =========================================================

  budgetBreakdown: [
    {
      label: "Flights",
      amount: 48900,
    },
    {
      label: "Accommodation",
      amount: 42000,
    },
    {
      label: "Food",
      amount: 19000,
    },
    {
      label: "Local Transport",
      amount: 9500,
    },
    {
      label: "Activities",
      amount: 13400,
    },
    {
      label: "Emergency Buffer",
      amount: 11000,
    },
  ],

  // =========================================================
  // ITINERARY
  // =========================================================

  itinerary: [
    {
      id: "day-1",

      dayNumber: 1,

      title: "Arrival & Neon Tokyo",

      date: "10 Nov 2026",

      estimatedCost: 14800,

      weather: {
        temperature: 18,
        condition: "Clear",
      },

      activities: [
        {
          id: "activity-1",

          title: "Airport Transfer to Shinjuku",

          description:
            "Travel from Narita Airport to your hotel in Shinjuku with time to settle in.",

          type: "transport",

          groundingType: "generic",

          startTime: "3:30 PM",

          duration: "1h 30m",

          location: "Narita → Shinjuku",

          estimatedCost: 3200,

          image: "/images/itinerary/tokyo-transfer.jpg",
        },

        {
          id: "activity-2",

          title: "Check-in at Shinjuku Granbell Hotel",

          description:
            "Check in, refresh and take a short break before your first evening in Tokyo.",

          type: "hotel",

          groundingType: "generic",

          startTime: "5:30 PM",

          duration: "Flexible",

          location: "Shinjuku",

          estimatedCost: 0,

          image: "/images/hotels/shinjuku.jpg",
        },

        {
          id: "activity-3",

          title: "Omoide Yokocho Dinner",

          description:
            "Explore one of Shinjuku's atmospheric alleyways and enjoy local yakitori and Japanese comfort food.",

          type: "food",

          groundingType: "generic",

          startTime: "7:30 PM",

          duration: "1h 30m",

          location: "Shinjuku",

          estimatedCost: 2800,

          booked: false,

          image: "/images/itinerary/tokyo-food.jpg",
        },

        {
          id: "activity-4",

          title: "Tokyo Metropolitan Government Observatory",

          description:
            "Finish your first evening with panoramic nighttime views over Tokyo.",

          type: "attraction",

          groundingType: "generic",

          startTime: "9:15 PM",

          duration: "1h",

          location: "Shinjuku",

          estimatedCost: 0,

          image: "/images/itinerary/tokyo-night.jpg",
        },
      ],
    },

    {
      id: "day-2",

      dayNumber: 2,

      title: "Tradition Meets Shibuya",

      date: "11 Nov 2026",

      estimatedCost: 12600,

      weather: {
        temperature: 19,
        condition: "Mostly Clear",
      },

      activities: [
        {
          id: "activity-5",

          title: "Meiji Shrine",

          description:
            "Start the day with a peaceful walk through the forested grounds of Meiji Shrine.",

          type: "attraction",

          groundingType: "generic",

          startTime: "9:00 AM",

          duration: "1h 30m",

          location: "Shibuya",

          estimatedCost: 0,
        },

        {
          id: "activity-6",

          title: "Harajuku & Takeshita Street",

          description:
            "Explore youth fashion, street culture, cafés and shops in Harajuku.",

          type: "shopping",

          groundingType: "generic",

          startTime: "11:00 AM",

          duration: "2h",

          location: "Harajuku",

          estimatedCost: 2500,
        },

        {
          id: "activity-7",

          title: "Shibuya Sky",

          description:
            "Experience panoramic sunset views from one of Tokyo's most impressive observation decks.",

          type: "attraction",

          groundingType: "generic",

          startTime: "5:00 PM",

          duration: "1h 30m",

          location: "Shibuya",

          estimatedCost: 2200,

          booked: true,
        },
      ],
    },

    {
      id: "day-3",

      dayNumber: 3,

      title: "Technology & Digital Art",

      date: "12 Nov 2026",

      estimatedCost: 15400,

      weather: {
        temperature: 17,
        condition: "Partly Cloudy",
      },

      activities: [
        {
          id: "activity-8",

          title: "teamLab Borderless",

          description:
            "Explore immersive digital installations combining light, sound and interactive technology.",

          type: "experience",

          groundingType: "generic",

          startTime: "10:00 AM",

          duration: "2h 30m",

          location: "Azabudai Hills",

          estimatedCost: 3800,

          booked: true,
        },

        {
          id: "activity-9",

          title: "Akihabara",

          description:
            "Spend the afternoon exploring electronics, gaming, anime and technology culture.",

          type: "shopping",

          groundingType: "generic",

          startTime: "2:00 PM",

          duration: "3h",

          location: "Akihabara",

          estimatedCost: 4000,
        },
      ],
    },
  ],

  // =========================================================
  // BUDGET PAGE
  // =========================================================

  budgetCategories: [
    {
      id: "budget-flight",

      label: "Flights",

      amount: 48900,

      source: "live",

      type: "flight",
    },

    {
      id: "budget-hotel",

      label: "Accommodation",

      amount: 42000,

      source: "live",

      type: "hotel",
    },

    {
      id: "budget-food",

      label: "Food & Dining",

      amount: 19000,

      source: "estimated",

      type: "food",
    },

    {
      id: "budget-transport",

      label: "Local Transport",

      amount: 9500,

      source: "estimated",

      type: "transport",
    },

    {
      id: "budget-activities",

      label: "Activities",

      amount: 13400,

      source: "estimated",

      type: "activities",
    },

    {
      id: "budget-buffer",

      label: "Emergency Buffer",

      amount: 11000,

      source: "estimated",

      type: "buffer",
    },
  ],

  budgetInsight:
    "Accommodation and flights currently make up most of your trip cost. Your hotel location is excellent for reducing local transport time, so VoyageAI recommends optimizing the flight before changing accommodation.",

  potentialSavings: 12400,

  budgetRecommendations: [
    {
      id: "recommendation-flight",

      title: "Choose a Different Flight Window",

      description:
        "A slightly later departure with one longer connection could reduce your flight cost while keeping the same travel date.",

      savings: 8400,

      type: "flight",
    },

    {
      id: "recommendation-food",

      title: "Balance Premium Dining",

      description:
        "Replace two premium dinner reservations with highly rated local restaurants while keeping your main omakase experience.",

      savings: 4000,

      type: "food",
    },
  ],

  // =========================================================
  // PLACES
  // =========================================================

  places: [
    {
      id: "place-teamlab",

      name: "teamLab Borderless",

      category: "technology",

      location: "Azabudai Hills",

      description:
        "Immersive digital art museum combining light, sound and interactive technology.",

      image: "/images/places/teamlab.jpg",

      visitDuration: "2h 30m",

      estimatedCost: 3800,

      rating: 4.8,

      itineraryDay: 3,

      status: "planned",

      saved: true,

      recommended: true,

      recommendationReason:
        "Strong match for your technology and photography interests.",
    },

    {
      id: "place-meiji",

      name: "Meiji Shrine",

      category: "culture",

      location: "Shibuya",

      description:
        "A peaceful Shinto shrine surrounded by a large forest in central Tokyo.",

      image: "/images/places/meiji.jpg",

      visitDuration: "1h 30m",

      estimatedCost: 0,

      rating: 4.7,

      itineraryDay: 2,

      status: "planned",

      saved: false,

      recommended: true,

      recommendationReason:
        "Pairs efficiently with Harajuku and Shibuya activities on Day 2.",
    },

    {
      id: "place-shibuya",

      name: "Shibuya Sky",

      category: "attraction",

      location: "Shibuya",

      description:
        "Open-air observation deck offering panoramic views across Tokyo.",

      image: "/images/places/shibuya-sky.jpg",

      visitDuration: "1h 30m",

      estimatedCost: 2200,

      rating: 4.7,

      itineraryDay: 2,

      status: "planned",

      saved: true,

      recommended: true,

      recommendationReason:
        "Excellent sunset photography opportunity with minimal additional travel.",
    },

    {
      id: "place-akihabara",

      name: "Akihabara",

      category: "technology",

      location: "Chiyoda",

      description:
        "Tokyo's famous electronics, gaming, anime and technology district.",

      image: "/images/places/akihabara.jpg",

      visitDuration: "3 hours",

      estimatedCost: 0,

      rating: 4.6,

      itineraryDay: 3,

      status: "planned",

      saved: false,

      recommended: true,

      recommendationReason:
        "Directly aligns with your technology interest profile.",
    },

    {
      id: "place-sensoji",

      name: "Senso-ji Temple",

      category: "culture",

      location: "Asakusa",

      description:
        "Tokyo's oldest Buddhist temple and one of the city's most recognizable cultural landmarks.",

      image: "/images/places/sensoji.jpg",

      visitDuration: "1h 30m",

      estimatedCost: 0,

      rating: 4.7,

      status: "saved",

      saved: true,

      recommended: false,
    },

    {
      id: "place-tsukiji",

      name: "Tsukiji Outer Market",

      category: "food",

      location: "Chuo",

      description:
        "Bustling food market known for fresh seafood, sushi and Japanese street food.",

      image: "/images/places/tsukiji.jpg",

      visitDuration: "2 hours",

      estimatedCost: 2500,

      rating: 4.5,

      status: "optional",

      saved: false,

      recommended: true,

      recommendationReason:
        "Strong food-interest match and works well as a morning activity.",
    },
  ],

  // =========================================================
  // PLACE ALTERNATIVES
  // =========================================================

  placeAlternatives: [
    {
      id: "alternative-omoide",

      name: "Omoide Yokocho",

      description:
        "Traditional alleyway dining in Shinjuku offering a more atmospheric local experience.",

      image:
        "/images/places/omoide-yokocho.jpg",

      benefit: "interest",

      replacingPlaceId: "place-tsukiji",
    },

    {
      id: "alternative-ueno",

      name: "Ueno Park",

      description:
        "Large public park combining museums, temples and green space with minimal admission cost.",

      image: "/images/places/ueno-park.jpg",

      benefit: "cost",

      savings: 1800,

      replacingPlaceId: "place-shibuya",
    },

    {
      id: "alternative-yanaka",

      name: "Yanaka Ginza",

      description:
        "Traditional Tokyo neighborhood offering quieter streets and local food away from major tourist crowds.",

      benefit: "crowds",

      image: "/images/places/yanaka.jpg",
    },
  ],

  // =========================================================
  // MAP
  // =========================================================

  mapDays: [
    {
      dayNumber: 1,

      date: "10 Nov 2026",

      title: "Arrival & Neon Tokyo",

      locations: [
        {
          id: "map-airport",

          name: "Narita International Airport",

          subtitle: "Arrival & Transfer",

          dayNumber: 1,

          time: "3:30 PM",

          type: "transport",

          mapX: 20,
          mapY: 25,

          duration: "1h 30m",

          estimatedCost: 3200,

          transportToNext: {
            mode: "train",

            duration: "1h 20m",
          },
        },

        {
          id: "map-hotel",

          name: "Shinjuku Granbell Hotel",

          subtitle: "Hotel Check-in",

          dayNumber: 1,

          time: "5:30 PM",

          type: "hotel",

          image: "/images/hotels/shinjuku.jpg",

          mapX: 44,
          mapY: 46,

          duration: "Flexible",

          estimatedCost: 0,

          transportToNext: {
            mode: "walk",

            duration: "12 min",
          },
        },

        {
          id: "map-omoide",

          name: "Omoide Yokocho",

          subtitle: "Dinner",

          dayNumber: 1,

          time: "7:30 PM",

          type: "food",

          image:
            "/images/places/omoide-yokocho.jpg",

          mapX: 58,
          mapY: 57,

          duration: "1h 30m",

          estimatedCost: 2800,

          transportToNext: {
            mode: "walk",

            duration: "18 min",
          },
        },

        {
          id: "map-observatory",

          name:
            "Tokyo Metropolitan Government Observatory",

          subtitle: "Night Views",

          dayNumber: 1,

          time: "9:15 PM",

          type: "attraction",

          mapX: 73,
          mapY: 39,

          duration: "1h",

          estimatedCost: 0,
        },
      ],
    },

    {
      dayNumber: 2,

      date: "11 Nov 2026",

      title: "Tradition Meets Shibuya",

      locations: [
        {
          id: "map-meiji",

          name: "Meiji Shrine",

          subtitle: "Cultural Visit",

          dayNumber: 2,

          time: "9:00 AM",

          type: "attraction",

          image: "/images/places/meiji.jpg",

          mapX: 30,
          mapY: 28,

          duration: "1h 30m",

          estimatedCost: 0,

          transportToNext: {
            mode: "walk",

            duration: "10 min",
          },
        },

        {
          id: "map-harajuku",

          name: "Harajuku",

          subtitle: "Shopping & Culture",

          dayNumber: 2,

          time: "11:00 AM",

          type: "shopping",

          mapX: 46,
          mapY: 43,

          duration: "2h",

          estimatedCost: 2500,

          transportToNext: {
            mode: "train",

            duration: "7 min",
          },
        },

        {
          id: "map-shibuya",

          name: "Shibuya Sky",

          subtitle: "Sunset Views",

          dayNumber: 2,

          time: "5:00 PM",

          type: "attraction",

          image:
            "/images/places/shibuya-sky.jpg",

          mapX: 69,
          mapY: 64,

          duration: "1h 30m",

          estimatedCost: 2200,
        },
      ],
    },

    {
      dayNumber: 3,

      date: "12 Nov 2026",

      title: "Technology & Digital Art",

      locations: [
        {
          id: "map-teamlab",

          name: "teamLab Borderless",

          subtitle: "Digital Art",

          dayNumber: 3,

          time: "10:00 AM",

          type: "experience",

          image: "/images/places/teamlab.jpg",

          mapX: 25,
          mapY: 62,

          duration: "2h 30m",

          estimatedCost: 3800,

          transportToNext: {
            mode: "train",

            duration: "28 min",
          },
        },

        {
          id: "map-akihabara",

          name: "Akihabara",

          subtitle: "Technology District",

          dayNumber: 3,

          time: "2:00 PM",

          type: "shopping",

          image:
            "/images/places/akihabara.jpg",

          mapX: 67,
          mapY: 34,

          duration: "3h",

          estimatedCost: 4000,
        },
      ],
    },
  ],

  // =========================================================
  // AGENT ACTIVITY
  // =========================================================

  agentRun: {
    id: "VX-TYO-1025",

    title: "Tokyo Trip Planning",

    status: "running",

    startedAt: "16 Aug 2026 • 09:15",

    elapsedTime: "00:38",

    completedSteps: 6,

    totalSteps: 9,

    events: [
      {
        id: "activity-request",

        title: "Trip Request Parsed",

        description:
          "Travel dates, budget, pace, interests and traveler information were validated and prepared for planning.",

        status: "completed",

        type: "request",

        duration: "1.1s",

        result: "Planning constraints prepared",
      },

      {
        id: "activity-flight",

        title: "Flight Search",

        description:
          "VoyageAI searched suitable routes from Bangalore to Tokyo and shortlisted options matching the trip dates and budget.",

        status: "completed",

        type: "flight",

        duration: "7.2s",

        provider: "Flight Search API",

        result: "23 options compared",
      },

      {
        id: "activity-hotel",

        title: "Accommodation Search",

        description:
          "Hotels were evaluated based on price, transport access and proximity to planned Tokyo activities.",

        status: "completed",

        type: "hotel",

        duration: "5.8s",

        provider: "Hotel Search API",

        result: "18 properties evaluated",
      },

      {
        id: "activity-budget",

        title: "Budget Constraint Detected",

        description:
          "The initial combination of flight and accommodation options pushed the projected trip cost above the target allocation.",

        status: "warning",

        type: "budget",

        duration: "0.4s",

        result: "Optimization required",
      },

      {
        id: "activity-hotel-optimize",

        title: "Accommodation Optimized",

        description:
          "A better-value Shinjuku hotel was selected while preserving convenient access to the planned itinerary.",

        status: "completed",

        type: "optimization",

        duration: "4.4s",

        result: "Estimated savings INR 8,600",
      },

      {
        id: "activity-places",

        title: "Places Matched",

        description:
          "Technology, food, culture and photography-focused places were ranked against your trip preferences.",

        status: "completed",

        type: "places",

        duration: "3.9s",

        result: "14 places shortlisted",
      },

      {
        id: "activity-replan",

        title: "Autonomous Itinerary Optimization",

        description:
          "VoyageAI is rearranging activities to reduce unnecessary transit while preserving your priority experiences.",

        status: "running",

        type: "optimization",

        duration: "4.8s",
      },

      {
        id: "activity-weather",

        title: "Weather Validation",

        description:
          "Weather-sensitive activities will be checked against expected conditions for each itinerary day.",

        status: "queued",

        type: "weather",
      },

      {
        id: "activity-final",

        title: "Final Trip Validation",

        description:
          "VoyageAI will validate budget, itinerary timing and travel constraints before finalizing the updated plan.",

        status: "queued",

        type: "validation",
      },
    ],
  },

  flightOptions: [
    {
      id: "flight-ana",

      airline: "ANA",

      flightNumber: "NH838",

      from: "BLR",

      to: "NRT",

      departureTime: "20:15",

      arrivalTime: "14:10 +1",

      duration: "12h 25m",

      stops: 1,

      stopDescription: "Singapore",

      cabin: "Economy",

      baggage: "2 x 23kg",

      wifi: true,

      price: 48900,

      label: "recommended",

      current: true,
    },

    {
      id: "flight-singapore",

      airline:
        "Singapore Airlines",

      flightNumber: "SQ511",

      from: "BLR",

      to: "NRT",

      departureTime: "23:10",

      arrivalTime: "13:55 +1",

      duration: "10h 45m",

      stops: 1,

      stopDescription: "Singapore",

      cabin: "Economy",

      baggage: "2 x 23kg",

      wifi: true,

      price: 56400,

      label: "fastest",
    },

    {
      id: "flight-malaysia",

      airline:
        "Malaysia Airlines",

      flightNumber: "MH193",

      from: "BLR",

      to: "NRT",

      departureTime: "00:20",

      arrivalTime: "21:50",

      duration: "17h 30m",

      stops: 2,

      stopDescription:
        "Kuala Lumpur",

      cabin: "Economy",

      baggage: "25kg",

      wifi: false,

      price: 43800,

      label: "cheapest",
    },
  ],

  hotelOptions: [
    {
      id: "hotel-shinjuku",

      name:
        "Shinjuku Granbell Hotel",

      room:
        "Superior Double Room",

      location:
        "Shinjuku",

      address:
        "Kabukicho, Shinjuku City, Tokyo",

      image:
        "/images/hotels/shinjuku.jpg",

      rating: 4,

      pricePerNight:
        8400,

      nights: 5,

      amenities: [
        "Rooftop Bar",
        "Free Wi-Fi",
        "Near Metro",
      ],

      highlights: [
        "Excellent access to Shinjuku Station",
        "Close to nightlife and restaurants",
      ],

      current: true,

      label:
        "recommended",
    },

    {
      id: "hotel-shibuya",

      name:
        "Shibuya Stream Excel Hotel Tokyu",

      room:
        "Standard Double Room",

      location:
        "Shibuya",

      address:
        "Shibuya City, Tokyo",

      image:
        "/images/hotels/shibuya.jpg",

      rating: 5,

      pricePerNight:
        10200,

      nights: 5,

      amenities: [
        "City View",
        "Fitness Center",
        "Near Station",
      ],

      highlights: [
        "Excellent location for Shibuya activities",
        "Very convenient transport access",
      ],

      label:
        "closest",
    },

    {
      id: "hotel-asakusa",

      name:
        "Asakusa View Hotel",

      room:
        "Moderate Twin Room",

      location:
        "Asakusa",

      address:
        "Taito City, Tokyo",

      image:
        "/images/hotels/asakusa.jpg",

      rating: 4,

      pricePerNight:
        7200,

      nights: 5,

      amenities: [
        "Breakfast",
        "City View",
        "Free Wi-Fi",
      ],

      highlights: [
        "Lower total accommodation cost",
        "Good access to traditional Tokyo",
      ],

      label:
        "best-value",
    },
  ],

  placeDetails: [
    {
      id: "place-teamlab",

      name: "teamLab Borderless",

      category:
        "Technology & Art",

      location:
        "Azabudai Hills, Tokyo",

      image:
        "/images/places/teamlab.jpg",

      rating: 4.8,

      description:
        "teamLab Borderless is an immersive digital art museum where interactive installations flow across rooms without traditional boundaries. The experience combines light, sound, motion and responsive technology, making it especially well suited to your interests in technology and photography.",

      duration:
        "2h 30m",

      openingHours:
        "09:00 - 21:00",

      bestTime:
        "Morning",

      estimatedCost:
        3800,

      currency:
        "INR",

      status:
        "planned",

      saved: true,

      itineraryDay:
        3,

      aiInsight: {
        type:
          "recommendation",

        title:
          "Strong itinerary fit",

        description:
          "This place strongly matches your technology and photography preferences and is already grouped with nearby Day 3 activities to reduce additional travel time.",
      },

      nearby: [
        {
          id:
            "nearby-tokyo-tower",

          name:
            "Tokyo Tower",

          distance:
            "1.3 km away",

          image:
            "/images/places/tokyo-tower.jpg",
        },

        {
          id:
            "nearby-roppongi",

          name:
            "Roppongi Hills",

          distance:
            "1.7 km away",

          image:
            "/images/places/roppongi.jpg",
        },

        {
          id:
            "nearby-mori",

          name:
            "Mori Art Museum",

          distance:
            "1.8 km away",

          image:
            "/images/places/mori-art.jpg",
        },
      ],
    },

    {
      id:
        "place-shibuya",

      name:
        "Shibuya Sky",

      category:
        "Observation Deck",

      location:
        "Shibuya, Tokyo",

      image:
        "/images/places/shibuya-sky.jpg",

      rating: 4.7,

      description:
        "Shibuya Sky is an open-air observation experience above Shibuya Scramble Square, offering panoramic views across Tokyo. Sunset and early evening provide some of the best city photography conditions.",

      duration:
        "1h 30m",

      openingHours:
        "10:00 - 22:30",

      bestTime:
        "Sunset",

      estimatedCost:
        2200,

      currency:
        "INR",

      status:
        "planned",

      saved: true,

      itineraryDay:
        2,

      aiInsight: {
        type:
          "schedule",

        title:
          "Possible timing conflict",

        description:
          "Your current Shibuya Sky reservation is close to the evening dinner window. VoyageAI can move dinner slightly later or adjust another Day 2 activity.",
      },

      nearby: [
        {
          id:
            "nearby-crossing",

          name:
            "Shibuya Crossing",

          distance:
            "250 m away",

          image:
            "/images/places/shibuya-crossing.jpg",
        },

        {
          id:
            "nearby-hachiko",

          name:
            "Hachiko Statue",

          distance:
            "300 m away",

          image:
            "/images/places/hachiko.jpg",
        },
      ],
    },
  ],
};