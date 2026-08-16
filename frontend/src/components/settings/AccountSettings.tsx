"use client";

import {
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui";

interface AccountSettingsProps {
  onDeleteAction: () => void;
}

export default function AccountSettings({
  onDeleteAction,
}: AccountSettingsProps) {
  return (
    <section
      id="account"
      className="scroll-mt-24"
    >
      <div className="mb-3 flex items-center gap-2">
        <Trash2
          size={16}
          className="text-red-400"
        />

        <h2 className="text-base font-semibold text-red-400">
          Account
        </h2>
      </div>

      <div className="rounded-xl border border-red-400/20 bg-red-400/[0.04] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#e6e0e8]">
              Delete Account
            </h3>

            <p className="mt-1 max-w-xl text-xs leading-5 text-[#948e9c]">
              Permanently delete your VoyageAI account, trips, saved places and associated data. This action cannot be undone.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={
              onDeleteAction
            }
            className="shrink-0 border-red-400/30 text-red-400 hover:bg-red-400/10"
          >
            <Trash2 size={14} />

            Delete Account
          </Button>
        </div>
      </div>
    </section>
  );
}