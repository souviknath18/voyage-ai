"use client";

import type {
  ExploreCategory,
} from "@/types/explore";

interface ExploreCategoriesProps {
  activeCategory: ExploreCategory;

  onChangeAction: (
    category: ExploreCategory,
  ) => void;
}

const categories: {
  value: ExploreCategory;
  label: string;
}[] = [
  {
    value: "popular",
    label: "Popular Now",
  },
  {
    value: "culinary",
    label: "Culinary Escapes",
  },
  {
    value: "adventure",
    label: "Adventure",
  },
  {
    value: "beaches",
    label: "Secluded Beaches",
  },
  {
    value: "culture",
    label: "Deep Culture",
  },
  {
    value: "technology",
    label: "Tech Metropolis",
  },
];

export default function ExploreCategories({
  activeCategory,
  onChangeAction,
}: ExploreCategoriesProps) {
  return (
    <div className="overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="flex min-w-max gap-2 pb-2">
        {categories.map((category) => {
          const active =
            category.value === activeCategory;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() =>
                onChangeAction(
                  category.value,
                )
              }
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                active
                  ? "border-[#fb7185]/50 bg-[#fb7185]/15 text-[#fb7185]"
                  : "border-white/10 bg-white/[0.04] text-[#948e9c] hover:bg-white/[0.07] hover:text-[#cbc4d2]"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}