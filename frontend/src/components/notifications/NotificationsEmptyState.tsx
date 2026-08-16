import {
  BellOff,
} from "lucide-react";

export default function NotificationsEmptyState() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-5 py-16 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#948e9c]">
        <BellOff
          size={18}
        />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-[#e6e0e8]">
        No notifications
      </h2>

      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[#948e9c]">
        You&apos;re all caught up. VoyageAI will notify you when something important changes.
      </p>
    </div>
  );
}