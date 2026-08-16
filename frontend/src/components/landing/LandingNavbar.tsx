"use client";

import Link from "next/link";

import {
  Menu,
  PlaneTakeoff,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Button,
} from "@/components/ui";

const links = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How It Works",
    href: "#how-it-works",
  },
  {
    label: "Explore",
    href: "/login",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
];

export default function LandingNavbar() {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070B18]/95">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <PlaneTakeoff
            size={20}
            className="text-[#fb7185]"
          />

          <span className="voyage-gradient-text text-lg font-bold tracking-tight">
            VoyageAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(
            (link) => (
              <Link
                key={
                  link.label
                }
                href={
                  link.href
                }
                className="text-sm font-medium text-[#948e9c] transition hover:text-[#e6e0e8]"
              >
                {
                  link.label
                }
              </Link>
            ),
          )}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-[#cbc4d2] transition hover:text-[#fb7185]"
          >
            Sign In
          </Link>

          <Link href="/signup">
            <Button size="sm">
              Start Planning
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <button
          type="button"
          onClick={() =>
            setOpen(
              (
                previous,
              ) =>
                !previous,
            )
          }
          aria-label="Toggle navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#cbc4d2] md:hidden"
        >
          {open ? (
            <X size={19} />
          ) : (
            <Menu
              size={19}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 bg-[#070B18] px-4 py-4 md:hidden">
          <div className="space-y-1">
            {links.map(
              (link) => (
                <Link
                  key={
                    link.label
                  }
                  href={
                    link.href
                  }
                  onClick={() =>
                    setOpen(
                      false,
                    )
                  }
                  className="block rounded-lg px-3 py-2.5 text-sm text-[#cbc4d2] transition hover:bg-white/[0.05]"
                >
                  {
                    link.label
                  }
                </Link>
              ),
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() =>
                setOpen(false)
              }
            >
              <Button
                fullWidth
                variant="outline"
                size="sm"
              >
                Sign In
              </Button>
            </Link>

            <Link
              href="/plan-trip"
              onClick={() =>
                setOpen(false)
              }
            >
              <Link href="/signup">
                <Button size="sm">
                  Start Planning
                </Button>
              </Link>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}