"use client";

import {
  Save,
  Settings,
} from "lucide-react";

import {
  Button,
} from "@/components/ui";

interface SettingsHeaderProps {
  onSaveAction: () => void;
}

export default function SettingsHeader({
  onSaveAction,
}: SettingsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pt-2.5 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
      <div>
        <div className="flex items-center gap-2">
          <Settings
            size={19}
            className="text-[#fb7185]"
          />

          <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
            Settings
          </h1>
        </div>

        <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#948e9c]">
          Manage your account, travel preferences and VoyageAI experience.
        </p>
      </div>

      <div className="hidden sm:block">
        <Button
          size="md"
          onClick={
            onSaveAction
          }
        >
          <Save size={15} />

          Save Changes
        </Button>
      </div>
    </div>
  );
}