import type {
  VoyageNotification,
} from "@/types/notifications";

import NotificationCard from "./NotificationCard";

interface NotificationsSectionProps {
  title: string;

  notifications:
    VoyageNotification[];

  highlight?: boolean;

  onReadAction: (
    id: string,
  ) => void;
}

export default function NotificationsSection({
  title,
  notifications,
  highlight = false,
  onReadAction,
}: NotificationsSectionProps) {
  if (
    notifications.length === 0
  ) {
    return null;
  }

  return (
    <section>
      <div className="mb-3 flex items-center gap-2 px-1">
        {highlight && (
          <span className="h-1.5 w-1.5 rounded-full bg-[#fb7185] shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
        )}

        <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f8798]">
          {title}
        </h2>

        <span className="text-[10px] text-[#596174]">
          {
            notifications.length
          }
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map(
          (notification) => (
            <NotificationCard
              key={
                notification.id
              }
              notification={
                notification
              }
              onReadAction={
                onReadAction
              }
            />
          ),
        )}
      </div>
    </section>
  );
}