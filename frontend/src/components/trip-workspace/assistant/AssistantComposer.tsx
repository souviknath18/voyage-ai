"use client";

import {
  Mic,
  Send,
} from "lucide-react";

import {
  useState,
} from "react";

interface AssistantComposerProps {
  onSubmitAction: (
    message: string,
  ) => void;
}

export default function AssistantComposer({
  onSubmitAction,
}: AssistantComposerProps) {
  const [
    value,
    setValue,
  ] = useState("");

  const submit =
    () => {
      const message =
        value.trim();

      if (!message) {
        return;
      }

      onSubmitAction(
        message,
      );

      setValue("");
    };

  return (
    <div className="shrink-0 border-t border-white/10 bg-[#0A0F1F]/95 px-3 pb-3 pt-3 backdrop-blur-xl sm:px-4 sm:pb-4">
      <div className="mx-auto w-full max-w-3xl">
        {/* Input */}
        <div className="relative rounded-xl bg-gradient-to-r from-[#fb7185]/25 to-[#fcd34d]/20 p-px">
          <div className="flex items-end gap-2 rounded-xl bg-[#111628] p-2">
            <textarea
              value={value}
              onChange={(event) =>
                setValue(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  submit();
                }
              }}
              rows={2}
              placeholder="Ask VoyageAI to change, explain or optimize this trip..."
              className="max-h-28 min-h-[56px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm leading-5 text-[#e6e0e8] outline-none placeholder:text-[#7f8798] focus:ring-0 sm:min-h-10"
            />

            {/* Voice */}
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#948e9c] transition hover:bg-white/[0.05] hover:text-[#fcd34d]"
            >
              <Mic size={15} />
            </button>

            {/* Send */}
            <button
              type="button"
              onClick={submit}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#fb7185] to-[#fcd34d] text-[#070B18] transition hover:opacity-90"
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Always Visible Helper */}
        <p className="mt-2 text-center text-[9px] leading-4 text-[#596174]">
          VoyageAI may propose changes. Nothing is applied until you confirm.
        </p>
      </div>
    </div>
  );
}