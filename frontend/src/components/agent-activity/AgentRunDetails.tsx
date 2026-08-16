import type {
  GlobalAgentRun,
} from "@/types/agent-activity";

import AgentRunHero from "./AgentRunHero";
import AgentRunTimeline from "./AgentRunTimeline";

interface AgentRunDetailsProps {
  run:
    GlobalAgentRun;
}

export default function AgentRunDetails({
  run,
}: AgentRunDetailsProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <AgentRunHero
        run={run}
      />

      <AgentRunTimeline
        events={
          run.events
        }
      />
    </section>
  );
}