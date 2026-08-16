import {
  ReactNode,
} from "react";

import Badge from "./Badge";

interface PreferenceBadgeProps {
  children: ReactNode;
  value?: string;
}

export default function PreferenceBadge({
  children,
  value,
}: PreferenceBadgeProps) {
  const preference = (
    value ??
    String(children)
  )
    .trim()
    .toLowerCase();

  const getColor = () => {
    switch (preference) {
      /* Travel Pace */
      case "relaxed":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

      case "balanced":
        return "border-[#d1bcff]/20 bg-[#d1bcff]/10 text-[#d1bcff]";

      case "fast-paced":
      case "fast paced":
        return "border-orange-400/20 bg-orange-400/10 text-orange-300";

      /* Interests */
      case "technology":
      case "tech":
        return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";

      case "food":
      case "culinary":
        return "border-[#fcd34d]/20 bg-[#fcd34d]/10 text-[#fcd34d]";

      case "photography":
        return "border-violet-400/20 bg-violet-400/10 text-violet-300";

      case "culture":
        return "border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]";

      case "history":
        return "border-amber-400/20 bg-amber-400/10 text-amber-300";

      case "nature":
        return "border-green-400/20 bg-green-400/10 text-green-300";

      case "adventure":
        return "border-orange-400/20 bg-orange-400/10 text-orange-300";

      case "beach":
      case "beaches":
        return "border-sky-400/20 bg-sky-400/10 text-sky-300";

      case "shopping":
        return "border-pink-400/20 bg-pink-400/10 text-pink-300";

      case "nightlife":
        return "border-purple-400/20 bg-purple-400/10 text-purple-300";

      case "architecture":
        return "border-indigo-400/20 bg-indigo-400/10 text-indigo-300";

      default:
        return "border-white/10 bg-white/[0.05] text-[#cbc4d2]";
    }
  };

  return (
    <Badge
      variant="neutral"
      className={getColor()}
    >
      {children}
    </Badge>
  );
}