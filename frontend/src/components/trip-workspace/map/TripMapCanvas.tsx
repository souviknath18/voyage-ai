"use client";

import {
  Map,
  TrainFront,
} from "lucide-react";

import type {
  TripMapLocation,
} from "@/types/trip-workspace";

import MapPlacePopup from "./MapPlacePopup";

interface TripMapCanvasProps {
  locations: TripMapLocation[];

  selectedLocationId?: string;

  currency: string;

  onSelectLocationAction: (
    id: string,
  ) => void;

  onClearSelectionAction: () => void;

  onModifyLocationAction: (
    id: string,
  ) => void;
}

export default function TripMapCanvas({
  locations,
  selectedLocationId,
  currency,
  onSelectLocationAction,
  onClearSelectionAction,
  onModifyLocationAction,
}: TripMapCanvasProps) {
  const selectedLocation =
    locations.find(
      (location) =>
        location.id ===
        selectedLocationId,
    );

  /*
   * Map canvas coordinate system:
   *
   * width  = 1000
   * height = 650
   *
   * mapX/mapY remain percentages,
   * so the SVG route and HTML
   * markers use exactly the same
   * positions.
   */
  const getX = (
    location: TripMapLocation,
  ) => location.mapX * 10;

  const getY = (
    location: TripMapLocation,
  ) => location.mapY * 6.5;

  /*
   * Create the same Q-shaped curved
   * paths used by the reference.
   *
   * Each next curve alternates:
   *
   *    ╭─────
   * ───╯
   *
   * then:
   *
   * ───╮
   *    ╰─────
   *
   * This produces the smooth
   * wave-like route.
   */
  const createRoutePath = (
    current: TripMapLocation,
    next: TripMapLocation,
    index: number,
  ) => {
    const x1 =
      getX(current);

    const y1 =
      getY(current);

    const x2 =
      getX(next);

    const y2 =
      getY(next);

    const middleX =
      (x1 + x2) / 2;

    const middleY =
      (y1 + y2) / 2;

    /*
     * Similar curve strength to
     * reference example.
     */
    const curveAmount = 90;

    const controlY =
      index % 2 === 0
        ? middleY -
          curveAmount
        : middleY +
          curveAmount;

    return `
      M ${x1} ${y1}
      Q ${middleX} ${controlY}
        ${x2} ${y2}
    `;
  };

  return (
    <div
      className="relative h-[520px] overflow-hidden rounded-xl border border-white/10 lg:h-[650px]"
      style={{
        backgroundColor:
          "#141218",

        /*
         * Same background treatment
         * as the reference.
         *
         * Put your own Tokyo/map image:
         *
         * public/images/maps/tokyo-map.jpg
         */
        backgroundImage: `
          linear-gradient(
            rgba(20, 18, 24, 0.70),
            rgba(20, 18, 24, 0.90)
          ),
          url('/images/maps/tokyo-map.jpg')
        `,

        backgroundSize:
          "cover",

        backgroundPosition:
          "center",
      }}
    >
      {/* ===================== */}
      {/* Extra Dark Atmosphere */}
      {/* ===================== */}

      <div className="pointer-events-none absolute inset-0 bg-[#141218]/10" />

      {/* Subtle Violet Atmosphere */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#2E1065]/20 blur-[90px]" />

      {/* Coral Atmosphere */}
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[#fb7185]/[0.06] blur-[100px]" />

      {/* ===================== */}
      {/* Map Title */}
      {/* ===================== */}

      <div className="absolute right-4 top-4 z-30 flex items-center gap-2 rounded-lg border border-white/10 bg-[#211f24]/80 px-3 py-2 shadow-lg backdrop-blur-md">
        <Map
          size={13}
          className="text-[#d1bcff]"
        />

        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#cbc4d2]">
          Trip Route
        </span>
      </div>

      {/* ===================== */}
      {/* SVG ROUTE */}
      {/* ===================== */}

      {locations.length >
        1 && (
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          viewBox="0 0 1000 650"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Exact VoyageAI Gradient */}
            <linearGradient
              id="lineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#FB7185"
              />

              <stop
                offset="100%"
                stopColor="#FCD34D"
              />
            </linearGradient>

            {/* Very subtle glow */}
            <filter
              id="routeGlow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur
                stdDeviation="2"
                result="blur"
              />

              <feMerge>
                <feMergeNode
                  in="blur"
                />

                <feMergeNode
                  in="SourceGraphic"
                />
              </feMerge>
            </filter>
          </defs>

          {locations
            .slice(0, -1)
            .map(
              (
                location,
                index,
              ) => {
                const next =
                  locations[
                    index + 1
                  ];

                return (
                  <path
                    key={`${location.id}-${next.id}`}
                    d={createRoutePath(
                      location,
                      next,
                      index,
                    )}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="5 5"
                    vectorEffect="non-scaling-stroke"
                    filter="url(#routeGlow)"
                    className="voyage-map-path"
                  />
                );
              },
            )}
        </svg>
      )}

      {/* ===================== */}
      {/* MAP MARKERS */}
      {/* ===================== */}

      {locations.map(
        (
          location,
          index,
        ) => {
          const active =
            selectedLocationId ===
            location.id;

          return (
            <button
              key={
                location.id
              }
              type="button"
              aria-label={`Select ${location.name}`}
              onClick={() =>
                onSelectLocationAction(
                  location.id,
                )
              }
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${location.mapX}%`,
                top: `${location.mapY}%`,
              }}
            >
              {active ? (
                /*
                 * Active Marker
                 *
                 * Same concept as reference:
                 * larger coral → amber circle.
                 */
                <span className="voyage-marker-pulse relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#fb7185] to-[#fcd34d] shadow-[0_0_20px_rgba(251,113,133,0.8)] transition-transform duration-300">
                  <span className="text-sm font-bold leading-none text-[#24005b]">
                    {index + 1}
                  </span>
                </span>
              ) : (
                /*
                 * Regular Marker
                 */
                <span className="voyage-marker-pulse relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#fb7185] bg-[#2E1065] shadow-[0_0_15px_rgba(251,113,133,0.5)] transition-transform duration-300 hover:scale-110">
                  <span className="text-sm font-bold leading-none text-[#fb7185]">
                    {index + 1}
                  </span>
                </span>
              )}
            </button>
          );
        },
      )}

      {/* ===================== */}
      {/* Travel Route Label */}
      {/* ===================== */}

      {locations.length >
        1 && (
        <div className="absolute left-1/2 top-[43%] z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#211f24]/80 px-3 py-1.5 shadow-lg backdrop-blur-md">
          <TrainFront
            size={12}
            className="text-[#fcd34d]"
          />

          <span className="whitespace-nowrap text-[10px] font-medium text-[#e6e0e8]">
            Optimized travel route
          </span>
        </div>
      )}

      {/* ===================== */}
      {/* Selected Place */}
      {/* ===================== */}

      {selectedLocation && (
        <div
          className="absolute z-40"
          style={{
            left: `${Math.min(
              Math.max(
                selectedLocation.mapX,
                20,
              ),
              78,
            )}%`,

            top: `${Math.min(
              Math.max(
                selectedLocation.mapY +
                  9,
                20,
              ),
              61,
            )}%`,

            transform:
              "translateX(-50%)",
          }}
        >
          <MapPlacePopup
            location={
              selectedLocation
            }
            currency={
              currency
            }
            onCloseAction={
              onClearSelectionAction
            }
            onModifyAction={
              onModifyLocationAction
            }
          />
        </div>
      )}

      {/* ===================== */}
      {/* Animations */}
      {/* ===================== */}

      <style jsx>{`
        /*
         * Same animation approach
         * as your reference.
         *
         * Slow movement looks like
         * travel flowing through route.
         */
        .voyage-map-path {
          animation: route-dash
            20s linear infinite;
        }

        @keyframes route-dash {
          to {
            stroke-dashoffset: -1000;
          }
        }

        /*
         * Marker glow from reference.
         */
        .voyage-marker-pulse {
          animation: marker-glow
            2s infinite alternate;
        }

        @keyframes marker-glow {
          from {
            box-shadow:
              0 0 10px
              rgba(
                251,
                113,
                133,
                0.2
              );
          }

          to {
            box-shadow:
              0 0 20px
              rgba(
                251,
                113,
                133,
                0.6
              );
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .voyage-map-path,
          .voyage-marker-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}