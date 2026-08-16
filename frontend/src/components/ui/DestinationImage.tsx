"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ImageOff,
  MapPin,
} from "lucide-react";

interface DestinationImageProps {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}

type ImageStatus =
  | "loading"
  | "loaded"
  | "error";

export default function DestinationImage({
  src,
  alt,
  className = "",
  imageClassName = "",
}: DestinationImageProps) {
  const [status, setStatus] =
    useState<ImageStatus>(
      src ? "loading" : "error",
    );

  const imageRef =
    useRef<HTMLImageElement>(null);

  /*
   * Handles cached images after refresh.
   *
   * Sometimes the browser already has the image
   * completely loaded before React's onLoad handler
   * gets a chance to update the state.
   */
  useEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    const image =
      imageRef.current;

    if (!image) {
      return;
    }

    const checkImage = () => {
      /*
       * Image is already fully loaded,
       * including browser-cached images.
       */
      if (image.complete) {
        if (
          image.naturalWidth > 0 &&
          image.naturalHeight > 0
        ) {
          setStatus("loaded");
        } else {
          setStatus("error");
        }
      }
    };

    /*
     * Check immediately.
     */
    checkImage();

    /*
     * Check once again on next browser frame.
     * This helps after hydration / refresh.
     */
    const frame =
      requestAnimationFrame(
        checkImage,
      );

    return () => {
      cancelAnimationFrame(
        frame,
      );
    };
  }, [src]);

  const handleLoad = () => {
    setStatus("loaded");
  };

  const handleError = () => {
    setStatus("error");
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#0D1324] ${className}`}
    >
      {/* Professional Placeholder */}
      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#11182b] via-[#0D1324] to-[#161225] transition-opacity duration-300 ${
          status === "loaded"
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        }`}
      >
        {/* Purple Glow */}
        <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#d1bcff]/[0.06] blur-3xl" />

        {/* Coral Glow */}
        <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-[#fb7185]/[0.07] blur-3xl" />

        {/* Bottom Horizon */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#070B18]/70 to-transparent" />

        {/* Placeholder Content */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[#d1bcff] shadow-lg">
            <MapPin size={20} />
          </div>

          <p className="mt-3 text-xs font-semibold text-[#cbc4d2]">
            Destination preview
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#7f8798]">
            <ImageOff size={11} />

            <span>
              {status === "loading"
                ? "Loading destination..."
                : "Image unavailable"}
            </span>
          </div>

          <span className="mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#948e9c]/60">
            VoyageAI
          </span>
        </div>
      </div>

      {/* Actual Image */}
      {src && (
        <img
          ref={imageRef}
          key={src}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            status === "loaded"
              ? "opacity-100"
              : "opacity-0"
          } ${imageClassName}`}
        />
      )}
    </div>
  );
}