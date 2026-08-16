import {
  CalendarDays,
} from "lucide-react";

export default function ExportItineraryPreview() {
  return (
    <section>
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <CalendarDays
          size={18}
          className="text-[#fb7185]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Itinerary Overview
        </h2>
      </div>

      <div className="ml-2 mt-5 space-y-6 border-l border-white/10 pl-5">
        <PreviewDay
          day="Day 1"
          title="Arrival & Shinjuku"
          date="10 Nov 2026"
          description="Arrive in Tokyo, transfer to Shinjuku and settle into your hotel before exploring the neighborhood."
        />

        <PreviewDay
          day="Day 2"
          title="Culture & Shibuya"
          date="11 Nov 2026"
          description="Visit Meiji Shrine, explore Shibuya and finish the evening with panoramic views from Shibuya Sky."
          accent="coral"
        />

        <PreviewDay
          day="Day 3"
          title="Technology & Digital Art"
          date="12 Nov 2026"
          description="Experience teamLab Borderless followed by an afternoon exploring Akihabara."
        />
      </div>
    </section>
  );
}

function PreviewDay({
  day,
  title,
  date,
  description,
  accent,
}: {
  day: string;

  title: string;

  date: string;

  description: string;

  accent?:
    "coral";
}) {
  return (
    <div className="relative">
      <span
        className={`absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[#141218] ${
          accent === "coral"
            ? "bg-[#fb7185]"
            : "bg-[#fcd34d]"
        }`}
      />

      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
        {day}
      </p>

      <h3 className="mt-1 text-sm font-semibold text-[#e6e0e8]">
        {title}
      </h3>

      <p className="mt-1 text-[11px] text-[#948e9c]">
        {date}
      </p>

      <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.025] p-3">
        <p className="text-xs leading-5 text-[#cbc4d2]">
          {description}
        </p>
      </div>
    </div>
  );
}