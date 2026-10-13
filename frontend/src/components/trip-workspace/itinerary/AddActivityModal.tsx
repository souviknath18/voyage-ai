
"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  Check,
  Clock3,
  ImageOff,
  Loader2,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";

import TimePicker from "@/components/ui/TimePicker";
import { getPlaceImagesBatch } from "@/lib/api";
import { getTrip, getTripPlaces, type TripPlace } from "@/lib/trips";

interface AddActivityModalProps {
  open: boolean;
  tripId: string;
  dayNumber: number;
  submitting: boolean;
  onCloseAction: () => void;
  onSubmitAction: (
    placeId: string,
    time: string,
    durationMinutes: number,
  ) => Promise<void>;
}

type PlaceWithImage = TripPlace & {
  image_url?: string | null;
  image?: string | null;
};

const durationOptions = [
  { label: "30 min", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "3 hours", value: 180 },
];

function PlaceImage({ place }: { place: PlaceWithImage }) {
  const imageUrl = place.image || place.image_url || null;
  const imageRef = useRef<HTMLImageElement>(null);

  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const loaded = Boolean(imageUrl && loadedUrl === imageUrl);
  const failed = Boolean(imageUrl && failedUrl === imageUrl);

  useEffect(() => {
    if (!imageUrl) return;

    const image = imageRef.current;
    if (!image) return;

    const checkCachedImage = () => {
      if (!image.complete) return;

      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        setLoadedUrl(imageUrl);
        setFailedUrl(null);
      } else {
        setFailedUrl(imageUrl);
      }
    };

    checkCachedImage();

    const frame = requestAnimationFrame(checkCachedImage);
    return () => cancelAnimationFrame(frame);
  }, [imageUrl]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#10182A]">
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#202B43] to-[#0B1121] transition-opacity duration-300 ${
          loaded && !failed
            ? "pointer-events-none opacity-0"
            : "opacity-100"
        }`}
      >
        <ImageOff
          size={24}
          strokeWidth={1.5}
          className="text-[#68748B]"
        />
      </div>

      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imageRef}
          key={imageUrl}
          src={imageUrl}
          alt={place.name}
          onLoad={() => {
            setLoadedUrl(imageUrl);
            setFailedUrl(null);
          }}
          onError={() => {
            setFailedUrl(imageUrl);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded && !failed ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

export default function AddActivityModal({
  open,
  tripId,
  dayNumber,
  submitting,
  onCloseAction,
  onSubmitAction,
}: AddActivityModalProps) {
  const titleId = useId();

  const [mounted, setMounted] = useState(false);
  const [places, setPlaces] = useState<PlaceWithImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [placeId, setPlaceId] = useState("");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onCloseAction();
      }
    };

    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("keydown", onEscape);
    };
  }, [open, submitting, onCloseAction]);

  useEffect(() => {
    if (!open || !tripId) return;

    let cancelled = false;

    setPlaces([]);
    setSearch("");
    setPlaceId("");
    setTime("10:00");
    setDuration(60);
    setError(null);
    setLoading(true);

    const loadPlaces = async () => {
      try {
        const [trip, apiPlaces] = await Promise.all([
          getTrip(tripId),
          getTripPlaces(tripId),
        ]);

        if (cancelled) return;

        setPlaces(apiPlaces);
        setLoading(false);

        if (apiPlaces.length === 0) return;

        const requests = apiPlaces.map((place) => ({
          key: place.id,
          place_name: place.name,
          destination: trip.destination_name || trip.destination,
          country: trip.destination_country,
        }));

        const batchSize = 30;
        const placeImages: Record<string, string> = {};

        for (
          let index = 0;
          index < requests.length;
          index += batchSize
        ) {
          if (cancelled) return;

          const batch = requests.slice(index, index + batchSize);

          try {
            const response = await getPlaceImagesBatch(batch);

            if (process.env.NODE_ENV === "development") {
              console.table(
                response.images.map((item) => ({
                  placeId: item.key,
                  hasImage: Boolean(item.image?.url),
                  imageUrl: item.image?.url ?? "NO IMAGE RETURNED",
                })),
              );
            }

            if (cancelled) return;

            for (const item of response.images) {
              if (item.image?.url) {
                placeImages[item.key] = item.image.url;
              }
            }

            setPlaces(
              apiPlaces.map((place) => ({
                ...place,
                image: placeImages[place.id] ?? null,
              })),
            );
          } catch (imageError) {
            console.warn(
              "Failed to load place images:",
              imageError,
            );
          }
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load trip places.",
        );

        setLoading(false);
      }
    };

    void loadPlaces();

    return () => {
      cancelled = true;
    };
  }, [open, tripId]);

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return places;

    return places.filter((place) =>
      [
        place.name,
        place.address,
        place.search_group,
        ...(place.categories ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [places, search]);

  const selectedPlace = places.find(
    (place) => place.id === placeId,
  );

  const canSubmit =
    Boolean(placeId) &&
    !loading &&
    !submitting &&
    Number.isInteger(duration) &&
    duration >= 15 &&
    duration <= 1440;

  const handleClose = () => {
    if (!submitting) onCloseAction();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    await onSubmitAction(placeId, time, duration);
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <button
        type="button"
        aria-label="Close add activity dialog"
        onClick={handleClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden p-3 sm:p-5">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="pointer-events-auto flex h-[94dvh] max-h-[calc(100dvh-24px)] min-h-0 w-full min-w-0 max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1324] shadow-[0_25px_90px_rgba(0,0,0,0.7)] sm:max-h-[calc(100dvh-40px)]"
        >
          {/* Fixed Header */}
          <header className="relative flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#fb7185] via-[#fda4af] to-transparent" />

            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]">
                <Plus size={21} />
              </div>

              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-[#F4F1F6]"
                >
                  Add Activity
                </h2>

                <p className="mt-1 text-xs text-[#949BAD] sm:text-sm">
                  Choose a place and plan your visit.
                </p>

                <span className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-[#fb7185]/20 bg-[#fb7185]/10 px-2.5 py-1 text-xs font-medium text-[#fb7185]">
                  <CalendarDays size={13} />
                  Day {dayNumber}
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close"
              disabled={submitting}
              onClick={handleClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#949BAD] transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              <X size={19} />
            </button>
          </header>

          {/*
            RESPONSIVE SCROLL LAYOUT

            Mobile:
            - One main vertical scrollbar
            - Places list also has its own limited scrolling area

            Desktop:
            - Main container does NOT scroll
            - Left and right panels have independent scrollbars
            - Both panels stay above the footer
          */}
          <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-3 pb-6 sm:p-6 lg:overflow-hidden lg:pb-6">
            <div className="grid min-h-0 min-w-0 grid-cols-1 gap-6 lg:h-full lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:overflow-hidden">

              {/* Left: Places */}
              <div className="flex min-h-0 min-w-0 flex-col lg:h-full lg:overflow-hidden">
                <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#F4F1F6]">
                    Select a Place
                  </h3>

                  {!loading && !error && (
                    <span className="shrink-0 text-xs text-[#949BAD]">
                      {filteredPlaces.length} places
                    </span>
                  )}
                </div>

                {/* Search remains fixed above places list */}
                <div className="relative shrink-0">
                  <Search
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#798399]"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    disabled={submitting}
                    placeholder="Search places, attractions, restaurants..."
                    className="h-11 w-full min-w-0 rounded-xl border border-white/10 bg-[#080E1D] pl-11 pr-3 text-sm text-white outline-none transition placeholder:text-[#798399] focus:border-[#fb7185]/50 focus:ring-1 focus:ring-[#fb7185]/20"
                  />
                </div>

                {/* Independent Left Scrollbar */}
                <div
                  className="mt-4 min-h-0 min-w-0 max-h-[42dvh] overflow-x-hidden overflow-y-auto overscroll-contain pr-1 lg:mb-0 lg:max-h-none lg:flex-1"
                  style={{
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {loading && (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#151D30] py-12 text-sm text-[#949BAD]">
                      <Loader2
                        size={17}
                        className="animate-spin text-[#fb7185]"
                      />
                      Loading places...
                    </div>
                  )}

                  {!loading && error && (
                    <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  {!loading &&
                    !error &&
                    filteredPlaces.length === 0 && (
                      <div className="rounded-xl border border-dashed border-white/10 bg-[#151D30] p-8 text-center">
                        <MapPin
                          size={25}
                          className="mx-auto mb-3 text-[#798399]"
                        />

                        <p className="text-sm font-medium text-white">
                          No places found
                        </p>

                        <p className="mt-1 text-xs text-[#949BAD]">
                          Try another search or discover more places.
                        </p>
                      </div>
                    )}

                  {!loading && !error && (
                    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                      {filteredPlaces.map((place) => {
                        const selected = place.id === placeId;

                        return (
                          <button
                            key={place.id}
                            type="button"
                            disabled={submitting}
                            onClick={() => setPlaceId(place.id)}
                            aria-pressed={selected}
                            className={`group relative flex min-w-0 flex-col overflow-hidden rounded-xl border text-left transition-all disabled:opacity-50 ${
                              selected
                                ? "border-[#fb7185] bg-[#fb7185]/[0.07] shadow-[0_0_0_1px_rgba(251,113,133,0.2)]"
                                : "border-white/10 bg-[#151D30] hover:border-[#fb7185]/30 hover:bg-[#1A2438]"
                            }`}
                          >
                            <div className="relative h-32 w-full overflow-hidden bg-[#10182A] sm:h-36">
                              <PlaceImage place={place} />

                              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#10182A]/70 to-transparent" />

                              <div
                                className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border backdrop-blur-sm ${
                                  selected
                                    ? "border-[#fb7185] bg-[#fb7185] text-[#0D1324]"
                                    : "border-white/30 bg-[#0D1324]/70 text-white"
                                }`}
                              >
                                {selected ? (
                                  <Check size={15} strokeWidth={3} />
                                ) : (
                                  <Plus size={14} />
                                )}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1 p-3">
                              <p className="line-clamp-2 break-words text-sm font-semibold text-[#F4F1F6]">
                                {place.name}
                              </p>

                              {place.address && (
                                <div className="mt-1.5 flex min-w-0 items-start gap-1">
                                  <MapPin
                                    size={12}
                                    className="mt-0.5 shrink-0 text-[#fb7185]"
                                  />

                                  <p className="line-clamp-2 min-w-0 break-words text-xs leading-4 text-[#949BAD]">
                                    {place.address}
                                  </p>
                                </div>
                              )}

                              {place.search_group && (
                                <span className="mt-2 inline-block max-w-full truncate rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] capitalize text-[#B6BED0]">
                                  {place.search_group}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Independent Right Scrollbar */}
              <div
                className="min-w-0 lg:min-h-0 lg:h-full lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-contain lg:border-l lg:border-white/10 lg:pl-6 lg:pr-1"
                style={{
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <Clock3 size={17} className="text-[#fb7185]" />

                  <h3 className="text-sm font-semibold text-[#F4F1F6]">
                    Schedule Activity
                  </h3>
                </div>

                <div className="min-w-0 rounded-xl border border-white/10 bg-[#151D30] p-4">
                  <TimePicker
                    value={time}
                    onChangeAction={setTime}
                    disabled={submitting}
                    label="Start Time"
                  />

                  <div className="mt-5">
                    <label className="mb-3 block text-sm font-medium text-[#E6E0E8]">
                      Duration
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {durationOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          disabled={submitting}
                          onClick={() =>
                            setDuration(option.value)
                          }
                          className={`min-w-0 rounded-lg border px-2 py-2.5 text-xs font-medium transition disabled:opacity-50 ${
                            duration === option.value
                              ? "border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]"
                              : "border-white/10 bg-[#0D1324] text-[#B6BED0] hover:border-white/20"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="mt-4 min-w-0 rounded-xl border border-white/10 bg-[#151D30] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#949BAD]">
                    Activity Summary
                  </p>

                  {selectedPlace ? (
                    <div className="space-y-3">
                      <div className="flex min-w-0 items-start gap-2">
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-[#fb7185]"
                        />

                        <p className="min-w-0 break-words text-sm font-medium text-[#F4F1F6]">
                          {selectedPlace.name}
                        </p>
                      </div>

                      <p className="text-xs text-[#949BAD]">
                        Day {dayNumber} · {time} · {duration} minutes
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-[#949BAD]">
                      Select a place to preview your activity.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <footer className="relative z-10 flex shrink-0 items-center justify-end gap-3 border-t border-white/10 bg-[#0D1324] px-4 py-4 sm:px-6">
            <button
              type="button"
              disabled={submitting}
              onClick={handleClose}
              className="h-10 rounded-lg border border-white/10 bg-white/5 px-5 text-sm font-medium text-[#B6BED0] transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="voyage-gradient inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-[#24103F] shadow-[0_8px_25px_rgba(251,113,133,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(251,113,133,0.3)] disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add Activity
                </>
              )}
            </button>
          </footer>
        </section>
      </div>
    </div>,
    document.body,
  );
}
