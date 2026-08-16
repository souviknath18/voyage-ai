import {
  Bookmark,
  Globe2,
  Map,
} from "lucide-react";

const stats = [
  {
    label: "Trips",
    value: "12",
    icon: Map,
    accent:
      "text-[#d1bcff]",
  },

  {
    label: "Countries",
    value: "24",
    icon: Globe2,
    accent:
      "text-[#fcd34d]",
  },

  {
    label: "Saved",
    value: "86",
    icon: Bookmark,
    accent:
      "text-[#fb7185]",
  },
];

export default function DashboardStats() {
  return (
    <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 sm:mt-3 sm:px-5 sm:py-3.5">
      <div className="grid grid-cols-3 items-center">
        {stats.map(
          (
            stat,
            index,
          ) => {
            const Icon =
              stat.icon;

            return (
              <div
                key={
                  stat.label
                }
                className={`relative flex flex-col items-center justify-center text-center ${
                  index !==
                  stats.length -
                    1
                    ? "after:absolute after:right-0 after:h-9 after:w-px after:bg-white/10"
                    : ""
                }`}
              >
                <Icon
                  size={13}
                  className="mb-1.5 text-[#7f8798]"
                />

                <p
                  className={`text-lg font-semibold sm:text-xl ${stat.accent}`}
                >
                  {
                    stat.value
                  }
                </p>

                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#7f8798] sm:text-[10px]">
                  {
                    stat.label
                  }
                </p>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}