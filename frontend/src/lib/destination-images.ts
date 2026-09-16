const destinationImages: Record<string, string> = {
  // Add destination images here later.

  // Example:
  // tokyo: "/images/destinations/tokyo.jpg",
  // paris: "/images/destinations/paris.jpg",
  // dubai: "/images/destinations/dubai.jpg",
  // bali: "/images/destinations/bali.jpg",
};

export function getDestinationImage(
  destination: string,
): string | undefined {
  const normalizedDestination =
    destination
      .trim()
      .toLowerCase();

  return destinationImages[
    normalizedDestination
  ];
}