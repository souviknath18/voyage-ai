import Link from "next/link";

import {
  PlaneTakeoff,
} from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050813]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <PlaneTakeoff
            size={17}
            className="text-[#fb7185]"
          />

          <span className="voyage-gradient-text text-sm font-bold">
            VoyageAI
          </span>
        </Link>

        <p className="text-xs text-[#7f8798]">
          © 2026 VoyageAI. Intelligent journeys, thoughtfully planned.
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-[#7f8798]">
          <Link
            href="/privacy"
            className="transition hover:text-[#cbc4d2]"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="transition hover:text-[#cbc4d2]"
          >
            Terms
          </Link>

          <Link
            href="/contact"
            className="transition hover:text-[#cbc4d2]"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}