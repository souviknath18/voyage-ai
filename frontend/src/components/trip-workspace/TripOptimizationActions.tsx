"use client";

import {
  Activity,
  Coffee,
  DollarSign,
  Plus,
} from "lucide-react";

import {
  Button,
  Card,
} from "@/components/ui";

interface TripOptimizationActionsProps {
  onOptimizeAction: (
    type: string,
  ) => void;
}

const actions = [
  {
    id: "cheaper",
    label: "Make It Cheaper",
    icon: DollarSign,
  },

  {
    id: "comfortable",
    label: "More Comfortable",
    icon: Coffee,
  },

  {
    id: "less-busy",
    label: "Less Busy",
    icon: Activity,
  },

  {
    id: "more-activities",
    label: "Add Activities",
    icon: Plus,
  },
];

export default function TripOptimizationActions({
  onOptimizeAction,
}: TripOptimizationActionsProps) {
  return (
    <Card className="p-4 sm:p-5">
      <h2 className="text-base font-semibold text-[#e6e0e8]">
        Optimize Your Trip
      </h2>

      <p className="mt-1 text-xs text-[#948e9c]">
        Ask VoyageAI to adjust the plan while keeping your trip constraints.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon =
            action.icon;

          return (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() =>
                onOptimizeAction(
                  action.id,
                )
              }
            >
              <Icon size={13} />

              {action.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}