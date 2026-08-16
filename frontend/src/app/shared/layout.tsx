import type {
  ReactNode,
} from "react";

import SharedTripNavbar from "@/components/shared-trip/SharedTripNavbar";

interface SharedLayoutProps {
  children:
    ReactNode;
}

export default function SharedLayout({
  children,
}: SharedLayoutProps) {
  return (
    <div className="min-h-screen bg-[#070B18] text-[#e6e0e8]">
      <SharedTripNavbar />

      {children}
    </div>
  );
}