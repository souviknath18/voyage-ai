"use client";

import { useState } from "react";

import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#070B18] text-[#e6e0e8]">
      <DashboardSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseAction={() =>
          setMobileSidebarOpen(false)
        }
      />

      <DashboardNavbar
        onMenuClickAction={() =>
          setMobileSidebarOpen(true)
        }
      />

      <main className="min-h-screen bg-[#070B18] pt-14 md:ml-60">
        {children}
      </main>
    </div>
  );
}