"use client";

import {
  Bell,
  Globe2,
  LockKeyhole,
  SlidersHorizontal,
  UserRound,
  UserX,
} from "lucide-react";

const sections = [
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    id: "travel-preferences",
    label: "Travel Preferences",
    icon: SlidersHorizontal,
  },
  {
    id: "localization",
    label: "Currency & Region",
    icon: Globe2,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: LockKeyhole,
  },
  {
    id: "account",
    label: "Account",
    icon: UserX,
    danger: true,
  },
];

export default function SettingsNavigation() {
  const handleNavigate = (
    id: string,
  ) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <nav className="hidden lg:block">
      <div className="sticky top-20 space-y-1">
        {sections.map(
          (section) => {
            const Icon =
              section.icon;

            return (
              <button
                key={
                  section.id
                }
                type="button"
                onClick={() =>
                  handleNavigate(
                    section.id,
                  )
                }
                className={`flex w-full items-center gap-2.5 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-left text-xs font-medium transition ${
                  section.danger
                    ? "text-red-400/80 hover:border-red-400 hover:bg-red-400/[0.05] hover:text-red-400"
                    : "text-[#948e9c] hover:border-[#fb7185] hover:bg-white/[0.04] hover:text-[#e6e0e8]"
                }`}
              >
                <Icon size={14} />

                {section.label}
              </button>
            );
          },
        )}
      </div>
    </nav>
  );
}