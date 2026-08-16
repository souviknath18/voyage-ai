"use client";

import {
  ArrowRight,
  TriangleAlert,
} from "lucide-react";

import {
  Button,
  Card,
} from "@/components/ui";

interface TripWarningCardProps {
  title: string;
  description: string;

  onResolveAction: () => void;
}

export default function TripWarningCard({
  title,
  description,
  onResolveAction,
}: TripWarningCardProps) {
  return (
    <Card className="border-l-4 border-l-[#fcd34d] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <TriangleAlert
          size={18}
          className="mt-0.5 shrink-0 text-[#fcd34d]"
        />

        <div>
          <h3 className="text-sm font-semibold text-[#e6e0e8]">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#948e9c]">
            {description}
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={onResolveAction}
            className="mt-3 px-0 text-[#fcd34d]"
          >
            Resolve with AI

            <ArrowRight size={13} />
          </Button>
        </div>
      </div>
    </Card>
  );
}