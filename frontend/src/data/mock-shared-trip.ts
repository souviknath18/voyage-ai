import type {
  SharedTripData,
} from "@/types/shared-trip";

export const mockSharedTrip: SharedTripData = {
  shareId:
    "tokyo-x7k92",

  title:
    "Souvik's Tokyo Discovery",

  destination:
    "Tokyo",

  country:
    "Japan",

  image:
    "/images/explore/tokyo.jpg",

  startDate:
    "10 Nov 2026",

  endDate:
    "15 Nov 2026",

  duration: 6,

  travelers: 1,

  sharedBy:
    "Souvik",

  note:
    "A little preview of my Tokyo adventure!",

  hotel: {
    name:
      "Shinjuku Granbell Hotel",

    location:
      "Shinjuku, Tokyo",

    image:
      "/images/hotels/shinjuku.jpg",

    tags: [
      "Central Location",
      "City View",
      "Easy Transit",
    ],
  },

  days: [
    {
      id: "day-1",

      day: 1,

      title:
        "Arrival & Shinjuku",

      date:
        "10 Nov",

      activities: [
        {
          id:
            "activity-1",

          time:
            "09:00",

          title:
            "Arrival in Tokyo",

          description:
            "Arrive at Narita Airport and transfer to Shinjuku.",

          type:
            "arrival",
        },

        {
          id:
            "activity-2",

          time:
            "13:00",

          title:
            "Check-in: Shinjuku Granbell Hotel",

          description:
            "Settle in and take some time to relax after the flight.",

          type:
            "hotel",

          image:
            "/images/hotels/shinjuku.jpg",
        },

        {
          id:
            "activity-3",

          time:
            "17:30",

          title:
            "Explore Shinjuku",

          description:
            "Walk through the neighborhood and enjoy the evening city atmosphere.",

          type:
            "activity",
        },
      ],
    },

    {
      id:
        "day-2",

      day: 2,

      title:
        "Culture & City Views",

      date:
        "11 Nov",

      activities: [
        {
          id:
            "activity-4",

          time:
            "09:00",

          title:
            "Meiji Shrine",

          description:
            "Start the morning with a peaceful visit to one of Tokyo's most important shrines.",

          type:
            "activity",
        },

        {
          id:
            "activity-5",

          time:
            "14:00",

          title:
            "Shibuya Exploration",

          description:
            "Explore Shibuya Crossing, nearby streets and cafés.",

          type:
            "activity",
        },

        {
          id:
            "activity-6",

          time:
            "18:30",

          title:
            "Shibuya Sky",

          description:
            "Watch Tokyo light up from the rooftop observation deck.",

          type:
            "activity",

          status:
            "Reserved",
        },
      ],
    },

    {
      id:
        "day-3",

      day: 3,

      title:
        "Technology & Digital Art",

      date:
        "12 Nov",

      activities: [
        {
          id:
            "activity-7",

          time:
            "10:00",

          title:
            "teamLab Borderless",

          description:
            "Experience immersive digital installations and interactive art.",

          type:
            "activity",
        },

        {
          id:
            "activity-8",

          time:
            "15:00",

          title:
            "Akihabara",

          description:
            "Explore Tokyo's famous electronics, gaming and technology district.",

          type:
            "activity",
        },
      ],
    },
  ],
};