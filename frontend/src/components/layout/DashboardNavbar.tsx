"use client";

import Link from "next/link";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  logout,
} from "@/lib/auth";

import {
  useAuth,
} from "@/components/auth/AuthProvider";


interface DashboardNavbarProps {
  onMenuClickAction: () => void;
}


export default function DashboardNavbar({
  onMenuClickAction,
}: DashboardNavbarProps) {
  const router =
    useRouter();

  const {
    user: currentUser,
    clearUser,
  } = useAuth();

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const profileMenuRef =
    useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);


  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout failed:",
        error,
      );
    } finally {
      clearUser();

      setProfileOpen(false);

      router.replace(
        "/login",
      );
    }
  }


  const displayName =
    currentUser?.full_name?.trim() ||
    currentUser?.email ||
    "User";

  const avatarInitial =
    displayName
      .charAt(0)
      .toUpperCase();


  return (
    <header className="fixed right-0 top-0 z-40 flex h-14 w-full items-center justify-between border-b border-white/10 bg-[#070B18]/95 px-4 backdrop-blur-xl md:w-[calc(100%-15rem)] md:px-6">
      {/* Left */}
      <div className="flex items-center">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClickAction}
          aria-label="Open navigation menu"
          className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg text-[#cbc4d2] transition hover:bg-white/[0.06] hover:text-[#e6e0e8] md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Logo */}
        <h1 className="voyage-gradient-text mr-4 text-lg font-bold tracking-tight md:hidden">
          VoyageAI
        </h1>

        {/* Search */}
        <div className="voyage-pulse hidden w-60 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-xl md:flex">
          <Search
            size={15}
            className="shrink-0 text-[#948e9c]"
          />

          <input
            type="text"
            placeholder="Ask VoyageAI..."
            className="w-full border-none bg-transparent text-xs text-[#e6e0e8] outline-none placeholder:text-[#7f8798]"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification */}
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative rounded-full p-1.5 text-[#cbc4d2] transition hover:bg-white/[0.06] hover:text-[#fb7185]"
        >
          <Bell size={18} />

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#fb7185] ring-2 ring-[#070B18]" />
        </Link>

        {/* User */}
        <div
          ref={profileMenuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                (previous) =>
                  !previous,
              )
            }
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-1.5 rounded-full p-1 transition hover:bg-white/[0.05]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#fb7185] to-[#fcd34d] text-xs font-semibold text-[#24103F]">
              {avatarInitial}
            </div>

            <ChevronDown
              size={13}
              className={`hidden text-[#948e9c] transition-transform sm:block ${
                profileOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+0.6rem)] w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0D1324]/95 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              {/* User */}
              <div className="border-b border-white/10 px-4 py-3">
                <p className="truncate text-sm font-medium text-[#e6e0e8]">
                  {displayName}
                </p>

                <p className="mt-0.5 truncate text-xs text-[#7f8798]">
                  {currentUser?.email ?? "Loading account..."}
                </p>
              </div>

              {/* Navigation */}
              <div className="p-1.5">
                <Link
                  href="/settings"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#cbc4d2] transition hover:bg-white/[0.05] hover:text-[#e6e0e8]"
                >
                  <Settings
                    size={15}
                    className="text-[#948e9c]"
                  />

                  Settings
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-white/10 p-1.5">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[#fb7185] transition hover:bg-[#fb7185]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut
                    size={15}
                  />

                  {loggingOut
                    ? "Signing out..."
                    : "Sign out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}