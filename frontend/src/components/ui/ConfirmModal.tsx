"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Check,
  Loader2,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";

interface ConfirmModalProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirmAction: () => void | Promise<void>;
  loading?: boolean;
  confirmDisabled?: boolean;
  destructive?: boolean;
  children?: ReactNode;
}

export default function ConfirmModal({
  open,
  onOpenChangeAction,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirmAction,
  loading = false,
  confirmDisabled = false,
  destructive = false,
  children,
}: ConfirmModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;

    document.body.style.overflow = "hidden";

    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!loading) onOpenChangeAction(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          focusableSelector,
        ),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const frame = requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLElement>(focusableSelector)
        ?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [open, loading, onOpenChangeAction]);

  const handleClose = () => {
    if (!loading) onOpenChangeAction(false);
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-5">
      <button
        type="button"
        aria-label="Close dialog"
        disabled={loading}
        onClick={handleClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-[3px]"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative flex max-h-[calc(100dvh-2.5rem)] w-full max-w-md flex-col overflow-visible rounded-2xl border border-white/10 bg-[#0D1324] shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 p-5">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                destructive
                  ? "border-red-400/20 bg-red-400/10 text-red-400"
                  : "border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]"
              }`}
            >
              {destructive ? (
                <AlertTriangle size={16} />
              ) : (
                <Check size={16} />
              )}
            </div>

            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-base font-semibold text-[#e6e0e8]"
              >
                {title}
              </h2>

              {description && (
                <p
                  id={descriptionId}
                  className="mt-1 text-xs leading-5 text-[#948e9c]"
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            disabled={loading}
            onClick={handleClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#948e9c] transition hover:bg-white/[0.05] hover:text-[#e6e0e8] disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        {children && (
          <div className="min-h-0 overflow-visible p-5">
            <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              {children}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-white/10 p-4 sm:flex-row sm:justify-end sm:p-5">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={destructive ? "danger" : "primary"}
            disabled={loading || confirmDisabled}
            onClick={() => void onConfirmAction()}
            className={
              destructive
                ? "!bg-[#f87171] !text-[#1a0b0b] hover:!bg-[#ef4444] !border-[#f87171]/30 w-full sm:w-auto"
                : "w-full sm:w-auto"
            }
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {!destructive && <Check size={15} />}
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}