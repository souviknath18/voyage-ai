import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

interface DashboardNavbarProps {
  onMenuClickAction: () => void;
}

export default function DashboardNavbar({
  onMenuClickAction,
}: DashboardNavbarProps) {
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
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-1.5 text-[#cbc4d2] transition hover:bg-white/[0.06] hover:text-[#fb7185]"
        >
          <Bell size={18} />

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#fb7185] ring-2 ring-[#070B18]" />
        </button>

        {/* User */}
        <button
          type="button"
          aria-label="Open profile menu"
          className="flex items-center gap-1.5 rounded-full p-1 transition hover:bg-white/[0.05]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#fb7185] to-[#fcd34d] text-xs font-semibold text-[#24103F]">
            S
          </div>

          <ChevronDown
            size={13}
            className="hidden text-[#948e9c] sm:block"
          />
        </button>
      </div>
    </header>
  );
}