import {
  Bot,
} from "lucide-react";

export default function AgentActivityHeader() {
  return (
    <div className="pt-2.5 sm:pt-3">
      <div className="flex items-center gap-2">
        <Bot
          size={19}
          className="text-[#fb7185]"
        />

        <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] sm:text-2xl">
          Agent Activity
        </h1>
      </div>

      <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[#948e9c]">
        Review VoyageAI planning, optimization and re-planning runs across your trips.
      </p>
    </div>
  );
}