"use client";

import {
  Sparkles,
} from "lucide-react";

import {
  Button,
} from "@/components/ui";

interface MapRouteOptimizerProps {
  onOptimizeAction: () => void;
}

export default function MapRouteOptimizer({
  onOptimizeAction,
}: MapRouteOptimizerProps) {
  return (
    <Button
      onClick={onOptimizeAction}
      className="rounded-full px-5 shadow-[0_10px_30px_rgba(251,113,133,0.2)] sm:px-7"
    >
      <Sparkles size={15} />

      Optimize Route with VoyageAI
    </Button>
  );
}