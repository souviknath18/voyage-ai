import {
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  Button,
  Card,
} from "@/components/ui";

export default function PrivacySettings() {
  return (
    <section
      id="privacy"
      className="scroll-mt-24"
    >
      <div className="mb-3 flex items-center gap-2">
        <LockKeyhole
          size={16}
          className="text-[#d1bcff]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Privacy & Security
        </h2>
      </div>

      <Card className="divide-y divide-white/10 p-4 sm:p-5">
        <SecurityRow
          icon={KeyRound}
          title="Password"
          description="Update the password used to access your VoyageAI account."
          action="Change Password"
        />

        <SecurityRow
          icon={ShieldCheck}
          title="Account Security"
          description="Review authentication and active account sessions."
          action="Review Security"
          last
        />
      </Card>
    </section>
  );
}

function SecurityRow({
  icon: Icon,
  title,
  description,
  action,
  last = false,
}: {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  title: string;
  description: string;
  action: string;

  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
        last
          ? "pt-4"
          : "pb-4 first:pt-0"
      }`}
    >
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-[#d1bcff]">
          <Icon size={15} />
        </div>

        <div>
          <p className="text-sm font-medium text-[#e6e0e8]">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#948e9c]">
            {description}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
      >
        {action}
      </Button>
    </div>
  );
}