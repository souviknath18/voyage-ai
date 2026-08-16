"use client";

import {
  ImageOff,
  MapPin,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

interface ThumbnailImageProps {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}

type ImageStatus =
  | "loading"
  | "loaded"
  | "error";

export default function ThumbnailImage({
  src,
  alt,
  className = "",
  imageClassName = "",
}: ThumbnailImageProps) {
  const [status, setStatus] =
    useState<ImageStatus>(
      src ? "loading" : "error",
    );

  // Reset when src changes
  useEffect(() => {
    setStatus(
      src ? "loading" : "error",
    );
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-[#0D1324] ${className}`}
    >
      {/* Compact Placeholder */}
      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#11182b] via-[#0D1324] to-[#171326] transition-opacity duration-300 ${
          status === "loaded"
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        }`}
      >
        {/* Purple Glow */}
        <div className="absolute -left-8 -top-8 h-20 w-20 rounded-full bg-[#d1bcff]/10 blur-2xl" />

        {/* Coral Glow */}
        <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-[#fb7185]/10 blur-2xl" />

        {/* Decorative route */}
        <div className="absolute left-[28%] top-[20%] h-[65%] w-px rotate-[28deg] border-l border-dashed border-white/10" />

        {/* Main Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[#d1bcff] shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
            {status === "loading" ? (
              <MapPin
                size={16}
              />
            ) : (
              <ImageOff
                size={15}
              />
            )}
          </div>

          {/* Tiny VoyageAI mark */}
          <span className="mt-2 text-[7px] font-semibold uppercase tracking-[0.14em] text-[#948e9c]/50">
            VoyageAI
          </span>
        </div>
      </div>

      {/* Actual Image */}
      {src && (
        <img
          src={src}
          alt={alt}
          onLoad={() =>
            setStatus("loaded")
          }
          onError={() =>
            setStatus("error")
          }
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