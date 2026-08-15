import { Card } from "@/components/ui";

import { ShieldCheck } from "lucide-react";

export default function PrivacyCard() {
  return (
    <Card className="flex items-start gap-3 p-3.5 opacity-80 sm:items-center sm:p-4">
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d1bcff]/10 text-[#d1bcff] sm:h-10 sm:w-10">
        <ShieldCheck
          size={19}
          className="sm:size-[21px]"
        />
      </div>

      {/* Content */}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#e6e0e8]">
          Secure & Private
        </p>

        <p className="mt-1 text-xs leading-5 text-[#948e9c]">
          Your travel preferences remain private and are
          only used to build your trip.
        </p>
      </div>
    </Card>
  );
}