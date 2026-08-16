import {
  Bot,
} from "lucide-react";

import type {
  AssistantMessage as AssistantMessageType,
} from "@/types/trip-assistant";

interface AssistantMessageProps {
  message: AssistantMessageType;
}

export default function AssistantMessage({
  message,
}: AssistantMessageProps) {
  /* User Message */
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-[#d1bcff]/20 bg-[#2E1065]/45 px-4 py-3 shadow-[0_8px_24px_rgba(46,16,101,0.12)] sm:max-w-[70%]">
          <p className="text-sm leading-6 text-[#e6e0e8]">
            {message.content}
          </p>

          {message.time && (
            <p className="mt-2 text-right text-[9px] text-[#b8a9d4]">
              {message.time}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* VoyageAI Message */
  return (
    <div className="flex items-start gap-3">
      {/* AI Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#fb7185]/30 bg-[#fb7185]/10 text-[#fb7185]">
        <Bot size={14} />
      </div>

      {/* AI Message */}
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#fb7185]/20 bg-[#fb7185]/[0.07] px-4 py-3 shadow-[0_8px_24px_rgba(251,113,133,0.05)] sm:max-w-[75%]">
        <p className="text-sm leading-6 text-[#e6e0e8]">
          {message.content}
        </p>

        {message.time && (
          <p className="mt-2 text-[9px] text-[#b98d98]">
            {message.time}
          </p>
        )}
      </div>
    </div>
  );
}