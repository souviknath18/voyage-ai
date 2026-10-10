"use client";

import {
  ArrowRight,
  CheckCircle2,
  TriangleAlert,
} from "lucide-react";

import {
  Button,
  Card,
} from "@/components/ui";

interface TripWarningCardProps {
  title: string;
  description: string;
  hasConflict: boolean;
  onResolveAction?: () => void;
}

export default function TripWarningCard({
  title,
  description,
  hasConflict,
  onResolveAction,
}: TripWarningCardProps) {
  return (
    <Card
      className={`border-l-4 p-4 sm:p-5 ${
        hasConflict
          ? "border-l-[#fcd34d]"
          : "border-l-[#34d399]"
      }`}
    >
      <div className="flex items-start gap-3">
        {hasConflict ? (
          <TriangleAlert
            size={18}
            className="mt-0.5 shrink-0 text-[#fcd34d]"
          />
        ) : (
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-[#34d399]"
          />
        )}

        <div>
          <h3 className="text-sm font-semibold text-[#e6e0e8]">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#948e9c]">
            {description}
          </p>

          {hasConflict && onResolveAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResolveAction}
              className="mt-3 px-0 text-[#fcd34d]"
            >
              Resolve with AI
              <ArrowRight size={13} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}