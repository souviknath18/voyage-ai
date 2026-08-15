import { Card } from "@/components/ui";

import Link from "next/link";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface DestinationRecommendationCardProps {
  city: string;
  country: string;
  description: string;
  image: string;
  slug: string;
}

export default function DestinationRecommendationCard({
  city,
  country,
  description,
  image,
  slug,
}: DestinationRecommendationCardProps) {
  return (
    <Card className="flex min-h-[260px] overflow-hidden">
      <div className="relative z-10 flex w-full flex-col justify-center border-r border-white/10 bg-[#2e1065]/55 p-7 backdrop-blur-xl md:w-1/2">
        <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fcd34d]">
          <Sparkles size={14} />

          Curated for You
        </span>

        <h2 className="text-2xl font-semibold text-[#e6e0e8]">
          {city}, {country}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#cbc4d2]">
          {description}
        </p>

        <Link
          href={`/explore/${slug}`}
          className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#fb7185] transition hover:text-[#fcd34d]"
        >
          Explore Destination

          <ArrowRight size={16} />
        </Link>
      </div>

      <div
        className="relative hidden w-1/2 bg-cover bg-center md:block"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#2e1065]/80 via-[#2e1065]/20 to-transparent" />
      </div>
    </Card>
  );
}