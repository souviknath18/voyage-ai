
import {
  CheckCircle2,
  Clock3,
  Lightbulb,
} from "lucide-react";

import type {
  DashboardRecentActivity,
} from "@/lib/dashboard";

interface DashboardAgentActivityProps {
  activities: DashboardRecentActivity[];
}

const activityStyles = [
  "border-[#d1bcff]/20 bg-[#d1bcff]/10 text-[#d1bcff]",
  "border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]",
  "border-[#fcd34d]/20 bg-[#fcd34d]/10 text-[#fcd34d]",
];

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const difference = Math.max(
    0,
    Date.now() - date.getTime(),
  );

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getActivityDetails(
  activity: DashboardRecentActivity,
) {
  const status = activity.status.toLowerCase();

  if (status === "completed") {
    return {
      title: "AI Trip Planning Completed",
      icon: CheckCircle2,
    };
  }

  if (status === "failed") {
    return {
      title: "AI Trip Planning Failed",
      icon: Lightbulb,
    };
  }

  if (
    status === "running" ||
    status === "in_progress" ||
    status === "processing"
  ) {
    return {
      title: "AI Trip Planning in Progress",
      icon: Clock3,
    };
  }

  return {
    title: "AI Trip Planning Activity",
    icon: Lightbulb,
  };
}

export default function DashboardAgentActivity({
  activities,
}: DashboardAgentActivityProps) {
  const recentActivities = activities.slice(0, 3);

  return (
    <article className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Concierge Activity
        </h2>

        <span className="text-[10px] font-medium text-[#7f8798]">
          Recent
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {recentActivities.length === 0 ? (
          <div className="flex items-start gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${activityStyles[0]}`}
            >
              <Lightbulb size={13} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium leading-5 text-[#e6e0e8]">
                No recent activity
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-[#7f8798]">
                Your AI planning activity will appear here.
              </p>
            </div>
          </div>
        ) : (
          recentActivities.map((activity, index) => {
            const details = getActivityDetails(activity);
            const Icon = details.icon;

            const style =
              activityStyles[index % activityStyles.length];

            return (
              <div
                key={activity.agent_run_id}
                className="flex items-start gap-3"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${style}`}
                >
                  <Icon size={13} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium leading-5 text-[#e6e0e8]">
                    {details.title}
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-[#7f8798]">
                    {activity.destination}
                    {" • "}
                    {formatRelativeTime(activity.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}
