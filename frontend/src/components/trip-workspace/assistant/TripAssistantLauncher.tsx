"use client";

import {
  useState,
} from "react";

import FloatingAssistant from "./FloatingAssistant";
import FloatingAssistantDrawer from "./FloatingAssistantDrawer";

interface TripAssistantLauncherProps {
  tripId: string;

  destination: string;

  image?: string;
}

export default function TripAssistantLauncher({
  tripId,
  destination,
  image,
}: TripAssistantLauncherProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <FloatingAssistant
        open={open}
        onClickAction={() =>
          setOpen(true)
        }
      />

      {/* Floating Chat */}
      <FloatingAssistantDrawer
        open={open}
        tripId={tripId}
        destination={
          destination
        }
        image={image}
        onCloseAction={() =>
          setOpen(false)
        }
      />
    </>
  );
}