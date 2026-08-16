import type {
  VoyageNotification,
} from "@/types/notifications";

export const mockNotifications: VoyageNotification[] = [
  {
    id: "notification-1",

    type: "agent",

    status: "unread",

    category: "AI Agent Update",

    tripId: "amalfi-001",

    tripName: "Amalfi Escape",

    title:
      "VoyageAI finished optimizing your Amalfi Coast itinerary",

    description:
      "Your travel days were reorganized to reduce unnecessary transit and improve activity timing. Review the updated itinerary before applying the changes.",

    time: "Just now",

    actionLabel:
      "View Trip",

    actionHref:
      "/trips/amalfi-001",
  },

  {
    id: "notification-2",

    type: "trip",

    status: "unread",

    category:
      "Trip Update",

    tripId:
      "tokyo-001",

    tripName:
      "Tokyo Horizon",

    title:
      "A hotel option used in your plan is no longer available",

    description:
      "The selected hotel is unavailable for part of your stay. VoyageAI can compare alternatives that preserve your location, comfort and budget preferences.",

    time:
      "2 hrs ago",

    actionLabel:
      "Find Alternative",

    actionHref:
      "/trips/tokyo-001/hotels",
  },

  {
    id: "notification-3",

    type:
      "price",

    status:
      "read",

    category:
      "Price Change",

    tripId:
      "amalfi-001",

    tripName:
      "Amalfi Escape",

    title:
      "Your revised itinerary saves INR 12,400",

    description:
      "Changing the timing of several activities reduced transportation and accommodation costs without removing planned experiences.",

    time:
      "Yesterday",

    actionLabel:
      "Review Changes",

    actionHref:
      "/trips/amalfi-001/budget",
  },

  {
    id: "notification-4",

    type:
      "weather",

    status:
      "read",

    category:
      "Weather Info",

    tripId:
      "tokyo-001",

    tripName:
      "Tokyo Horizon",

    title:
      "Rain expected on Day 3 in Tokyo",

    description:
      "Current forecasts may affect outdoor activities. VoyageAI recommends moving your indoor experiences to this day.",

    time:
      "Mon, 9:00 AM",

    actionLabel:
      "Adjust Plan",

    actionHref:
      "/trips/tokyo-001/itinerary",
  },

  {
    id:
      "notification-5",

    type:
      "budget",

    status:
      "read",

    category:
      "Budget Update",

    tripId:
      "tokyo-001",

    tripName:
      "Tokyo Horizon",

    title:
      "Your trip remains within budget",

    description:
      "The latest estimate is INR 143,800 against your INR 150,000 budget, leaving INR 6,200 available.",

    time:
      "2 days ago",

    actionLabel:
      "View Budget",

    actionHref:
      "/trips/tokyo-001/budget",
  },
];