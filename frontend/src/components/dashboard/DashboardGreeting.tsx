import {
  Sparkles,
} from "lucide-react";

export default function DashboardGreeting() {
  return (
    <div className="flex h-full flex-col justify-end py-3">
      <div className="flex items-center gap-2">
        <Sparkles
          size={17}
          className="text-[#fb7185]"
        />

        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f8798]">
          VoyageAI Dashboard
        </p>
      </div>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#e6e0e8] sm:text-3xl lg:text-4xl">
        Welcome back,{" "}
        <span className="bg-gradient-to-r from-[#fb7185] to-[#fcd34d] bg-clip-text text-transparent">
          Souvik
        </span>
      </h1>

      <p className="mt-2 text-sm text-[#948e9c] sm:text-base">
        The world is waiting. Where to next?
      </p>
    </div>
  );
}