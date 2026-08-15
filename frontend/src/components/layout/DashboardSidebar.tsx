"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Bot,
  Bookmark,
  Compass,
  LayoutDashboard,
  Map,
  PlaneTakeoff,
  Plus,
  Settings,
  X,
} from "lucide-react";

import { Button } from "@/components/ui";

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onCloseAction?: () => void;
}

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Plan a Trip",
    href: "/plan-trip",
    icon: PlaneTakeoff,
  },
  {
    label: "My Trips",
    href: "/trips",
    icon: Map,
  },
  {
    label: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    label: "Saved Places",
    href: "/saved-places",
    icon: Bookmark,
  },
  {
    label: "Agent Activity",
    href: "/agent-activity",
    icon: Bot,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar({
  mobileOpen = false,
  onCloseAction,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onCloseAction}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-[60] flex h-screen w-60 flex-col border-r border-white/10 bg-[#070B18] px-3 py-4 shadow-[0_20px_40px_rgba(10,2,25,0.35)] transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo + Close */}
        <div className="mb-7 flex items-start justify-between px-2">
          <div>
            <h1 className="voyage-gradient-text text-2xl font-bold tracking-tight">
              VoyageAI
            </h1>

            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#948e9c]">
              AI Travel Concierge
            </p>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onCloseAction}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#948e9c] transition hover:bg-white/[0.06] hover:text-[#e6e0e8] md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseAction}
                className={`group flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                  active
                    ? "border-r-2 border-[#d1bcff] bg-white/[0.07] text-[#d1bcff]"
                    : "text-[#cbc4d2] hover:bg-white/[0.05] hover:text-[#d1bcff]"
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.3 : 1.8}
                />

                <span className="text-[13px] font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Plan New Trip */}
        <Link
          href="/plan-trip"
          onClick={onCloseAction}
          className="mt-4 block"
        >
          <Button
            type="button"
            fullWidth
            size="md"
          >
            <Plus size={17} />
            Plan New Trip
          </Button>
        </Link>
      </aside>
    </>
  );
}