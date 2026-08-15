"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onCloseAction: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  open,
  onCloseAction,
  title,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onCloseAction();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      document.body.style.overflow = "";
    };
  }, [open, onCloseAction]);

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        backdrop-blur-sm
      "
      onMouseDown={onCloseAction}
    >
      <div
        className="
          voyage-glass
          w-full
          max-w-lg
          rounded-xl
          shadow-2xl
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#e6e0e8]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onCloseAction}
            className="rounded-lg p-2 text-[#cbc4d2] transition hover:bg-white/[0.06] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="border-t border-white/10 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}