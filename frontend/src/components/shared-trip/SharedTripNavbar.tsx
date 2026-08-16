"use client";

import Link from "next/link";

import {
  Menu,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Button,
} from "@/components/ui";

export default function SharedTripNavbar() {
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const closeMenu =
    () => {
      setMenuOpen(false);
    };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#070B18]/95">
      {/* Main Navbar */}
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="voyage-gradient-text text-lg font-bold tracking-tight"
        >
          VoyageAI
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/explore"
            className="text-xs font-medium text-[#948e9c] transition hover:text-[#e6e0e8]"
          >
            Explore
          </Link>

          <Link
            href="/login"
            className="text-xs font-medium text-[#948e9c] transition hover:text-[#e6e0e8]"
          >
            Sign In
          </Link>

          <Link href="/plan-trip">
            <Button size="sm">
              Plan a Trip
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={
            menuOpen
          }
          onClick={() =>
            setMenuOpen(
              (previous) =>
                !previous,
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#cbc4d2] transition hover:bg-white/[0.06] hover:text-[#e6e0e8] md:hidden"
        >
          {menuOpen ? (
            <X size={19} />
          ) : (
            <Menu size={19} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#070B18] px-4 pb-4 pt-3 md:hidden">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-1">
            <Link
              href="/explore"
              onClick={
                closeMenu
              }
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#cbc4d2] transition hover:bg-white/[0.05] hover:text-[#e6e0e8]"
            >
              Explore
            </Link>

            <Link
              href="/login"
              onClick={
                closeMenu
              }
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#cbc4d2] transition hover:bg-white/[0.05] hover:text-[#e6e0e8]"
            >
              Sign In
            </Link>

            <Link
              href="/plan-trip"
              onClick={
                closeMenu
              }
              className="mt-2"
            >
              <Button
                fullWidth
                size="sm"
              >
                Plan a Trip
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}