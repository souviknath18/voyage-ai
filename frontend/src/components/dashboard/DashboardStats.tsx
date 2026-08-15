import { Card } from "@/components/ui";

interface DashboardStatsProps {
  trips: number;
  countries: number;
  savedPlaces: number;
}

export default function DashboardStats({
  trips,
  countries,
  savedPlaces,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Trips",
      value: trips,
      textColor: "text-[#d1bcff]",
    },
    {
      label: "Countries",
      value: countries,
      textColor: "text-[#eac33e]",
    },
    {
      label: "Saved",
      value: savedPlaces,
      textColor: "text-[#fb7185]",
    },
  ];

  return (
    <Card className="voyage-glow flex items-center justify-between p-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="contents"
        >
          <div className="flex-1 text-center">
            <p
              className={`text-3xl font-bold ${stat.textColor}`}
            >
              {stat.value}
            </p>

            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#cbc4d2]">
              {stat.label}
            </p>
          </div>

          {index < stats.length - 1 && (
            <div className="h-12 w-px bg-white/10" />
          )}
        </div>
      ))}
    </Card>
  );
}