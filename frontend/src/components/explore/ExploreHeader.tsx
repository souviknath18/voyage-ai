import {
  Compass,
} from "lucide-react";

export default function ExploreHeader() {
  return (
    <div className="pt-2.5 sm:pt-3">
      {/* Icon + Title */}
      <div className="flex items-center gap-2">
        <Compass
          size={19}
          className="text-[#fb7185]"
        />

        <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
          Explore Destinations
        </h1>
      </div>

      <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#948e9c]">
        Discover destinations tailored to your travel style,
        interests and budget.
      </p>
    </div>
  );
}