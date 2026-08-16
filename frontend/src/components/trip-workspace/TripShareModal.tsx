"use client";

import {
  Check,
  Copy,
  ExternalLink,
  Link2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  Button,
} from "@/components/ui";

interface TripShareModalProps {
  open: boolean;

  shareId: string;

  tripTitle: string;

  onCloseAction: () => void;
}

export default function TripShareModal({
  open,
  shareId,
  tripTitle,
  onCloseAction,
}: TripShareModalProps) {
  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    mounted,
    setMounted,
  ] = useState(false);

  /*
   * Portal can only render
   * after the browser mounts.
   */
  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  /*
   * Lock the entire document
   * while the modal is open.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow =
      "hidden";

    document.documentElement.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousBodyOverflow;

      document.documentElement.style.overflow =
        previousHtmlOverflow;
    };
  }, [open]);

  /*
   * Escape closes modal.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onCloseAction();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    onCloseAction,
  ]);

  if (
    !mounted ||
    !open
  ) {
    return null;
  }

  const shareUrl =
    `${window.location.origin}/shared/trips/${shareId}`;

  const handleCopy =
    async () => {
      try {
        await navigator.clipboard.writeText(
          shareUrl,
        );

        setCopied(true);

        window.setTimeout(
          () => {
            setCopied(false);
          },
          1800,
        );
      } catch (
        error
      ) {
        console.error(
          "Unable to copy share URL:",
          error,
        );
      }
    };

  const handleOpenSharedTrip =
    () => {
      window.open(
        shareUrl,
        "_blank",
        "noopener,noreferrer",
      );
    };

  return createPortal(
    /*
     * This now renders directly
     * under <body>.
     *
     * fixed inset-0 therefore covers
     * the REAL browser viewport.
     */
    <div className="fixed inset-0 z-[9999] h-[100dvh] w-screen overflow-hidden">
      {/* Full Viewport Overlay */}
      <button
        type="button"
        aria-label="Close share dialog"
        onClick={
          onCloseAction
        }
        className="absolute inset-0 h-full w-full bg-black/60"
      />

      {/* Modal Positioning */}
      <div className="pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center px-4 py-5">
        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-trip-title"
          className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0D1324] shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]">
                <Link2
                  size={16}
                />
              </div>

              <div className="min-w-0">
                <h2
                  id="share-trip-title"
                  className="text-base font-semibold text-[#e6e0e8]"
                >
                  Share Trip
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#948e9c]">
                  Share a read-only
                  version of{" "}
                  <span className="text-[#cbc4d2]">
                    {tripTitle}
                  </span>
                  .
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                onCloseAction
              }
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#948e9c] transition hover:bg-white/[0.05] hover:text-[#e6e0e8]"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5">
            {/* Visibility */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />

                <div>
                  <p className="text-sm font-medium text-[#e6e0e8]">
                    Anyone with the link
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#948e9c]">
                    Anyone who has this
                    link can view the
                    shared itinerary.
                    They cannot edit
                    your original trip.
                  </p>
                </div>
              </div>
            </div>

            {/* Share Link */}
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#7f8798]">
                Share Link
              </p>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#070B18] p-2">
                <div className="min-w-0 flex-1 px-2">
                  <p className="truncate text-xs text-[#cbc4d2]">
                    {shareUrl}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    handleCopy
                  }
                  className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-xs font-medium text-[#cbc4d2] transition hover:bg-white/[0.07] hover:text-[#e6e0e8]"
                >
                  {copied ? (
                    <>
                      <Check
                        size={13}
                        className="text-emerald-400"
                      />

                      Copied
                    </>
                  ) : (
                    <>
                      <Copy
                        size={13}
                      />

                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Privacy */}
            <p className="mt-3 text-[11px] leading-5 text-[#7f8798]">
              Private account data,
              AI activity, booking
              references and personal
              notes are not included
              in the shared view.
            </p>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={
                  onCloseAction
                }
              >
                Done
              </Button>

              <Button
                size="sm"
                onClick={
                  handleOpenSharedTrip
                }
              >
                <ExternalLink
                  size={14}
                />

                Open Shared Trip
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}