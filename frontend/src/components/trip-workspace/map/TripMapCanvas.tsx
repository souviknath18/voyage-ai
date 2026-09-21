"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Map as MapIcon,
} from "lucide-react";

import {
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
} from "maplibre-gl";

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


interface ProjectedLocation {
  id: string;

  x: number;
  y: number;
}


interface MapSize {
  width: number;
  height: number;
}


export default function TripMapCanvas({
  locations,
  selectedLocationId,
  currency,
  onSelectLocationAction,
  onClearSelectionAction,
  onModifyLocationAction,
}: TripMapCanvasProps) {
  const mapContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mapRef =
    useRef<MapLibreMap | null>(
      null,
    );

  const markersRef =
    useRef<Marker[]>([]);


  /*
   * Keep callback refs updated
   * without recreating MapLibre.
   */
  const onSelectRef =
    useRef(
      onSelectLocationAction,
    );

  const onClearRef =
    useRef(
      onClearSelectionAction,
    );


  useEffect(() => {
    onSelectRef.current =
      onSelectLocationAction;
  }, [
    onSelectLocationAction,
  ]);


  useEffect(() => {
    onClearRef.current =
      onClearSelectionAction;
  }, [
    onClearSelectionAction,
  ]);


  /*
   * Screen coordinates of all
   * geographic itinerary locations.
   */
  const [
    projectedLocations,
    setProjectedLocations,
  ] = useState<
    ProjectedLocation[]
  >([]);


  /*
   * Current map viewport size.
   *
   * Used for popup positioning.
   */
  const [
    mapSize,
    setMapSize,
  ] = useState<MapSize>({
    width: 0,
    height: 0,
  });


  /*
   * Only locations with valid real
   * latitude / longitude belong on
   * the map.
   */
  const validLocations =
    useMemo(
      () =>
        locations.filter(
          (location) =>
            location.latitude !==
              undefined &&
            location.longitude !==
              undefined &&
            Number.isFinite(
              location.latitude,
            ) &&
            Number.isFinite(
              location.longitude,
            ),
        ),
      [
        locations,
      ],
    );


  const selectedLocation =
    locations.find(
      (location) =>
        location.id ===
        selectedLocationId,
    );


  const selectedProjectedLocation =
    projectedLocations.find(
      (location) =>
        location.id ===
        selectedLocationId,
    );


  /*
   * =================================
   * PROJECT REAL COORDINATES
   * =================================
   *
   * Convert:
   *
   * latitude / longitude
   *
   * into:
   *
   * x / y pixels
   *
   * inside the current map viewport.
   */
  const updateProjectedLocations =
    useCallback(() => {
      const map =
        mapRef.current;


      if (!map) {
        return;
      }


      const container =
        map.getContainer();


      setMapSize({
        width:
          container.clientWidth,

        height:
          container.clientHeight,
      });


      const projected =
        validLocations.map(
          (location) => {
            const point =
              map.project([
                location.longitude!,
                location.latitude!,
              ]);


            return {
              id:
                location.id,

              x:
                point.x,

              y:
                point.y,
            };
          },
        );


      setProjectedLocations(
        projected,
      );
    }, [
      validLocations,
    ]);


  /*
   * =================================
   * CREATE MAP
   * =================================
   */
  useEffect(() => {
    if (
      !mapContainerRef.current ||
      mapRef.current
    ) {
      return;
    }


    const map =
      new MapLibreMap({
        container:
          mapContainerRef.current,


        /*
         * Real OpenStreetMap raster
         * tiles.
         */
        style: {
          version: 8,


          sources: {
            osm: {
              type:
                "raster",

              tiles: [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],

              tileSize:
                256,


              /*
               * IMPORTANT:
               *
               * Do not request OSM
               * tiles above z19.
               */
              minzoom:
                0,

              maxzoom:
                19,


              attribution:
                "© OpenStreetMap contributors",
            },
          },


          layers: [
            /*
             * Warm background underneath
             * raster tiles.
             *
             * Prevents black flashes
             * while dragging the map.
             */
            {
              id:
                "map-background",

              type:
                "background",

              paint: {
                "background-color":
                  "#c8c4bd",
              },
            },


            {
              id: "osm",
              type: "raster",
              source: "osm",

              paint: {
                "raster-opacity": 1,

                // Slightly darker to match
                // the VoyageAI theme.
                "raster-brightness-max": 0.82,

                // Slightly reduce strong map colors.
                "raster-saturation": -0.12,

                // Give roads / labels a little
                // more definition.
                "raster-contrast": 0.06,
              },
            },
          ],
        },


        /*
         * Temporary initial location.
         *
         * fitBounds() below moves to
         * actual itinerary locations.
         */
        center: [
          115.1889,
          -8.4095,
        ],

        zoom:
          9,


        /*
         * IMPORTANT:
         *
         * Prevent the user from zooming
         * to z20 / z21 and triggering
         * failed OSM tile requests.
         */
        maxZoom:
          19,
      });


    map.on(
      "load",
      () => {
        console.log(
          "MapLibre map loaded",
        );

        map.resize();
      },
    );


    map.on(
      "error",
      (
        event,
      ) => {
        console.error(
          "MapLibre error:",
          event.error,
        );
      },
    );


    /*
     * Zoom + compass controls.
     */
    map.addControl(
      new NavigationControl({
        showCompass:
          true,

        showZoom:
          true,
      }),
      "bottom-right",
    );


    /*
     * Clicking blank map closes
     * selected place popup.
     */
    map.on(
      "click",
      () => {
        onClearRef.current();
      },
    );


    mapRef.current =
      map;


    return () => {
      markersRef.current.forEach(
        (
          marker,
        ) => {
          marker.remove();
        },
      );


      markersRef.current =
        [];


      map.remove();


      mapRef.current =
        null;
    };
  }, []);


  /*
   * =================================
   * CREATE REAL POI MARKERS
   * =================================
   */
  useEffect(() => {
    const map =
      mapRef.current;


    if (!map) {
      return;
    }


    /*
     * Remove old day's markers.
     */
    markersRef.current.forEach(
      (
        marker,
      ) => {
        marker.remove();
      },
    );


    markersRef.current =
      [];


    if (
      validLocations.length ===
      0
    ) {
      setProjectedLocations(
        [],
      );

      return;
    }


    const bounds =
      new LngLatBounds();


    validLocations.forEach(
      (
        location,
        index,
      ) => {
        /*
         * Marker wrapper.
         */
        const markerButton =
          document.createElement(
            "button",
          );


        markerButton.type =
          "button";


        markerButton.setAttribute(
          "aria-label",
          `Select ${location.name}`,
        );


        markerButton.className =
          "voyage-map-marker";


        markerButton.dataset.locationId =
          location.id;


        /*
         * Visible numbered marker.
         */
        const markerInner =
          document.createElement(
            "span",
          );


        markerInner.className =
          "voyage-map-marker-inner";


        markerInner.textContent =
          String(
            index + 1,
          );


        markerButton.appendChild(
          markerInner,
        );


        /*
         * Click selects place.
         *
         * Hover only changes its
         * visual appearance.
         */
        markerButton.addEventListener(
          "click",
          (
            event,
          ) => {
            event.stopPropagation();


            onSelectRef.current(
              location.id,
            );
          },
        );


        /*
         * Real MapLibre geographic
         * marker.
         */
        const marker =
          new Marker({
            element:
              markerButton,

            anchor:
              "center",
          })
            .setLngLat([
              location.longitude!,
              location.latitude!,
            ])
            .addTo(
              map,
            );


        markersRef.current.push(
          marker,
        );


        /*
         * Extend map bounds around
         * this POI.
         */
        bounds.extend([
          location.longitude!,
          location.latitude!,
        ]);
      },
    );


    /*
     * =================================
     * KEEP CURVE + POPUP ATTACHED
     * =================================
     */
    const handleMapMovement =
      () => {
        updateProjectedLocations();
      };


    map.on(
      "move",
      handleMapMovement,
    );


    map.on(
      "zoom",
      handleMapMovement,
    );


    map.on(
      "resize",
      handleMapMovement,
    );


    /*
     * =================================
     * AUTO FIT CURRENT DAY
     * =================================
     */
    if (
      validLocations.length ===
      1
    ) {
      const location =
        validLocations[0];


      map.flyTo({
        center: [
          location.longitude!,
          location.latitude!,
        ],

        zoom:
          14,

        duration:
          800,
      });
    } else {
      map.fitBounds(
        bounds,
        {
          padding: {
            top:
              100,

            bottom:
              100,

            left:
              100,

            right:
              100,
          },

          maxZoom:
            14,

          duration:
            900,
        },
      );
    }


    /*
     * Get final projected positions
     * after fitBounds/flyTo finishes.
     */
    map.once(
      "idle",
      () => {
        map.resize();

        updateProjectedLocations();
      },
    );


    return () => {
      map.off(
        "move",
        handleMapMovement,
      );


      map.off(
        "zoom",
        handleMapMovement,
      );


      map.off(
        "resize",
        handleMapMovement,
      );
    };
  }, [
    validLocations,
    updateProjectedLocations,
  ]);


  /*
   * =================================
   * ACTIVE MARKER
   * =================================
   */
  useEffect(() => {
    const container =
      mapContainerRef.current;


    if (!container) {
      return;
    }


    const markerElements =
      container.querySelectorAll(
        ".voyage-map-marker",
      );


    markerElements.forEach(
      (
        element,
      ) => {
        if (
          !(
            element instanceof
            HTMLElement
          )
        ) {
          return;
        }


        const markerInner =
          element.querySelector(
            ".voyage-map-marker-inner",
          );


        if (
          !(
            markerInner instanceof
            HTMLElement
          )
        ) {
          return;
        }


        const active =
          element.dataset
            .locationId ===
          selectedLocationId;


        markerInner.classList.toggle(
          "voyage-map-marker-inner-active",
          active,
        );
      },
    );
  }, [
    selectedLocationId,
  ]);


  /*
   * =================================
   * MARKER RADIUS
   * =================================
   *
   * Used when trimming the curve so
   * that it touches only the border
   * of the marker.
   */
  const getMarkerRadius = (
    locationId:
      string,
  ) => {
    /*
     * Selected marker:
     * 48px diameter.
     */
    if (
      locationId ===
      selectedLocationId
    ) {
      return 24;
    }


    /*
     * Normal marker:
     * 40px diameter.
     */
    return 20;
  };


  /*
   * =================================
   * CURVED ITINERARY PATH
   * =================================
   */
  const createRoutePath = (
    current:
      ProjectedLocation,

    next:
      ProjectedLocation,

    index:
      number,
  ) => {
    const middleX =
      (
        current.x +
        next.x
      ) / 2;


    const middleY =
      (
        current.y +
        next.y
      ) / 2;


    const distance =
      Math.hypot(
        next.x -
          current.x,

        next.y -
          current.y,
      );


    /*
     * Dynamic curvature.
     */
    const curveAmount =
      Math.min(
        Math.max(
          distance *
            0.18,

          25,
        ),

        90,
      );


    const controlX =
      middleX;


    const controlY =
      index % 2 ===
      0
        ? middleY -
          curveAmount
        : middleY +
          curveAmount;


    /*
     * =================================
     * START OF CURVE
     * =================================
     */
    const startDx =
      controlX -
      current.x;


    const startDy =
      controlY -
      current.y;


    const startLength =
      Math.hypot(
        startDx,
        startDy,
      ) || 1;


    const startUnitX =
      startDx /
      startLength;


    const startUnitY =
      startDy /
      startLength;


    const startRadius =
      getMarkerRadius(
        current.id,
      );


    /*
     * Extra 2px prevents the SVG
     * stroke entering marker border.
     */
    const startOffset =
      startRadius +
      2;


    const startX =
      current.x +
      startUnitX *
        startOffset;


    const startY =
      current.y +
      startUnitY *
        startOffset;


    /*
     * =================================
     * END OF CURVE
     * =================================
     */
    const endDx =
      next.x -
      controlX;


    const endDy =
      next.y -
      controlY;


    const endLength =
      Math.hypot(
        endDx,
        endDy,
      ) || 1;


    const endUnitX =
      endDx /
      endLength;


    const endUnitY =
      endDy /
      endLength;


    const endRadius =
      getMarkerRadius(
        next.id,
      );


    const endOffset =
      endRadius +
      2;


    const endX =
      next.x -
      endUnitX *
        endOffset;


    const endY =
      next.y -
      endUnitY *
        endOffset;


    return `
      M ${startX} ${startY}
      Q ${controlX} ${controlY}
        ${endX} ${endY}
    `;
  };


  /*
   * =================================
   * POPUP POSITION
   * =================================
   */
  let popupLeft =
    0;

  let popupTop =
    0;

  let popupTransform =
    "translate(-50%, 30px)";


  if (
    selectedProjectedLocation &&
    mapSize.width >
      0 &&
    mapSize.height >
      0
  ) {
    /*
     * Approximate half popup width
     * plus edge spacing.
     */
    const horizontalPadding =
      185;


    popupLeft =
      Math.min(
        Math.max(
          selectedProjectedLocation.x,
          horizontalPadding,
        ),

        Math.max(
          horizontalPadding,
          mapSize.width -
            horizontalPadding,
        ),
      );


    popupTop =
      selectedProjectedLocation.y;


    /*
     * If marker is near bottom,
     * show popup above it.
     */
    if (
      selectedProjectedLocation.y >
      mapSize.height *
        0.58
    ) {
      popupTransform =
        "translate(-50%, calc(-100% - 30px))";
    }
  }


  return (
    <div className="relative h-[520px] overflow-hidden rounded-xl border border-white/10 bg-[#c8c4bd] lg:h-[650px]">

      {/* ===================== */}
      {/* REAL MAP */}
      {/* ===================== */}

      <div
        ref={
          mapContainerRef
        }
        className="voyage-real-map absolute inset-0 h-full w-full"
      />


      {/* ===================== */}
      {/* SUBTLE BRAND GLOW */}
      {/* ===================== */}

      <div className="pointer-events-none absolute -left-24 top-10 z-10 h-72 w-72 rounded-full bg-[#2E1065]/[0.025] blur-[100px]" />


      <div className="pointer-events-none absolute -bottom-24 right-0 z-10 h-72 w-72 rounded-full bg-[#fb7185]/[0.025] blur-[100px]" />


      {/* ===================== */}
      {/* CURVED ROUTE */}
      {/* ===================== */}

      {projectedLocations.length >
        1 && (
        <svg
          className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        >

          <defs>

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


          {projectedLocations
            .slice(
              0,
              -1,
            )
            .map(
              (
                location,
                index,
              ) => {
                const next =
                  projectedLocations[
                    index +
                      1
                  ];


                return (
                  <path
                    key={`${location.id}-${next.id}`}
                    d={
                      createRoutePath(
                        location,
                        next,
                        index,
                      )
                    }
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6 6"
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
      {/* MAP LABEL */}
      {/* ===================== */}

      <div className="pointer-events-none absolute right-4 top-4 z-40 flex items-center gap-2 rounded-lg border border-white/10 bg-[#211f24]/90 px-3 py-2 shadow-lg backdrop-blur-md">

        <MapIcon
          size={
            13
          }
          className="text-[#d1bcff]"
        />


        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#cbc4d2]">
          Itinerary Path
        </span>

      </div>


      {/* ===================== */}
      {/* SELECTED PLACE POPUP */}
      {/* ===================== */}

      {selectedLocation &&
        selectedProjectedLocation && (
        <div
          className="absolute z-50 w-[340px] max-w-[calc(100%-24px)]"
          style={{
            left:
              popupLeft,

            top:
              popupTop,

            transform:
              popupTransform,
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
      {/* EMPTY STATE */}
      {/* ===================== */}

      {validLocations.length ===
        0 && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">

          <div className="rounded-xl border border-white/10 bg-[#211f24]/90 px-5 py-4 text-center shadow-xl backdrop-blur-md">

            <MapIcon
              size={
                20
              }
              className="mx-auto mb-2 text-[#d1bcff]"
            />


            <p className="text-sm font-medium text-[#e6e0e8]">
              No verified places for
              this day
            </p>


            <p className="mt-1 text-xs text-[#948e9c]">
              Verified itinerary
              places will appear here.
            </p>

          </div>

        </div>
      )}


      {/* ===================== */}
      {/* STYLES */}
      {/* ===================== */}

      <style jsx global>{`

        /*
         * =============================
         * MAP BACKGROUND
         * =============================
         *
         * Matches unloaded OSM areas
         * so dragging does not expose
         * a black background.
         */

        .voyage-real-map {
          background: #c8c4bd;
        }

        .voyage-real-map
        .maplibregl-canvas-container {
          background: #c8c4bd;
        }

        .voyage-real-map
        .maplibregl-canvas {
          background: #c8c4bd;
        }


        /*
         * =============================
         * MAP MARKER LAYER
         * =============================
         */

        .voyage-real-map
        .maplibregl-marker {
          z-index:
            30;
        }


        /*
         * Marker wrapper is larger
         * than selected marker so the
         * glow/ring is not cramped.
         */
        .voyage-map-marker {
          width:
            56px;

          height:
            56px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          padding:
            0;

          margin:
            0;

          border:
            0;

          background:
            transparent;

          cursor:
            pointer;

          outline:
            none;
        }


        /*
         * =============================
         * NORMAL MARKER
         * =============================
         */

        .voyage-map-marker-inner {
          width:
            40px;

          height:
            40px;

          box-sizing:
            border-box;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          flex-shrink:
            0;

          border:
            2px solid
            #fb7185;

          border-radius:
            50%;

          background:
            #2e1065;

          color:
            #fb7185;

          font-size:
            14px;

          font-weight:
            700;

          line-height:
            1;

          box-shadow:
            0 0 15px
            rgba(
              251,
              113,
              133,
              0.5
            );

          transition:
            transform
              200ms ease,
            width
              200ms ease,
            height
              200ms ease,
            border
              200ms ease,
            background
              200ms ease,
            box-shadow
              200ms ease;

          animation:
            marker-glow
            2s
            infinite
            alternate;
        }


        /*
         * Hover marker.
         */
        .voyage-map-marker:hover
        .voyage-map-marker-inner {
          transform:
            scale(
              1.1
            );

          box-shadow:
            0 0 22px
            rgba(
              251,
              113,
              133,
              0.8
            );
        }


        /*
         * =============================
         * SELECTED MARKER
         * =============================
         *
         * Perfect circle:
         *
         * exact dimensions
         * +
         * box-sizing
         * +
         * border-radius 50%
         * +
         * fixed border
         * +
         * animation disabled
         */

        .voyage-map-marker-inner-active {
          width:
            48px;

          height:
            48px;

          box-sizing:
            border-box;

          flex-shrink:
            0;

          border:
            2px solid
            #fcd34d;

          border-radius:
            50%;

          color:
            #24005b;

          background:
            linear-gradient(
              135deg,
              #fb7185
                0%,
              #fcd34d
                100%
            );

          box-shadow:
            0 0 0 3px
            rgba(
              251,
              113,
              133,
              0.18
            ),
            0 0 24px
            rgba(
              251,
              113,
              133,
              0.65
            );

          animation:
            none;

          transform:
            none;
        }


        /*
         * Prevent hover scaling from
         * distorting selected marker.
         */
        .voyage-map-marker:hover
        .voyage-map-marker-inner-active {
          transform:
            none;

          box-shadow:
            0 0 0 3px
            rgba(
              251,
              113,
              133,
              0.18
            ),
            0 0 26px
            rgba(
              251,
              113,
              133,
              0.72
            );
        }


        /*
         * =============================
         * ROUTE ANIMATION
         * =============================
         */

        .voyage-map-path {
          animation:
            route-dash
            20s
            linear
            infinite;
        }


        @keyframes route-dash {
          to {
            stroke-dashoffset:
              -1000;
          }
        }


        /*
         * =============================
         * MARKER GLOW
         * =============================
         */

        @keyframes marker-glow {
          from {
            box-shadow:
              0 0 10px
              rgba(
                251,
                113,
                133,
                0.25
              );
          }

          to {
            box-shadow:
              0 0 22px
              rgba(
                251,
                113,
                133,
                0.7
              );
          }
        }


        /*
         * =============================
         * MAPLIBRE CONTROLS
         * =============================
         */

        .maplibregl-ctrl-group {
          overflow:
            hidden;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.12
            ) !important;

          border-radius:
            10px !important;

          background:
            rgba(
              33,
              31,
              36,
              0.94
            ) !important;

          backdrop-filter:
            blur(
              12px
            );
        }


        .maplibregl-ctrl-group
        button {
          background-color:
            transparent !important;
        }


        .maplibregl-ctrl-group
        button:hover {
          background-color:
            rgba(
              255,
              255,
              255,
              0.08
            ) !important;
        }


        .maplibregl-ctrl-icon {
          filter:
            invert(
              1
            );
        }


        /*
         * =============================
         * ATTRIBUTION
         * =============================
         */

        .maplibregl-ctrl-attrib {
          background:
            rgba(
              255,
              255,
              255,
              0.82
            ) !important;

          color:
            #4b4650 !important;
        }


        .maplibregl-ctrl-attrib
        a {
          color:
            #5d438f !important;
        }


        /*
         * =============================
         * ACCESSIBILITY
         * =============================
         */

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          .voyage-map-path,
          .voyage-map-marker-inner {
            animation:
              none;
          }
        }

      `}</style>

    </div>
  );
}