"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Loader2, MapPin } from "lucide-react";

import { searchLocations } from "@/lib/locations";
import type { LocationSuggestion } from "@/types/location";


interface LocationAutocompleteProps {
  value: string;
  selectedLocation: LocationSuggestion | null;
  placeholder?: string;
  onValueChange: (value: string) => void;
  onLocationSelect: (
    location: LocationSuggestion | null,
  ) => void;
}


export default function LocationAutocomplete({
  value,
  selectedLocation,
  placeholder = "Search for a city or destination",
  onValueChange,
  onLocationSelect,
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [isOpen, setIsOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);


  useEffect(() => {
    const query = value.trim();

    if (selectedLocation) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (query.length < 2) {
      setSuggestions([]);
      setError(null);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    const controller =
      new AbortController();

    const timeout = window.setTimeout(
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const results =
            await searchLocations(
              query,
              controller.signal,
            );

          if (controller.signal.aborted) {
            return;
          }

          setSuggestions(results);
          setIsOpen(true);
        } catch {
          if (controller.signal.aborted) {
            return;
          }

          setSuggestions([]);
          setError(
            "Unable to search locations.",
          );
          setIsOpen(true);
        } finally {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        }
      },
      350,
    );

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [value, selectedLocation]);


  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const newValue = event.target.value;

    onValueChange(newValue);

    if (selectedLocation) {
      onLocationSelect(null);
    }

    if (newValue.trim().length >= 2) {
      setIsOpen(true);
    }
  }


  function handleSelect(
    location: LocationSuggestion,
  ) {
    onValueChange(location.formattedName);
    onLocationSelect(location);

    setSuggestions([]);
    setError(null);
    setIsOpen(false);
  }


  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#948e9c]"
        />

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => {
            if (
              !selectedLocation &&
              value.trim().length >= 2
            ) {
              setIsOpen(true);
            }
          }}
          autoComplete="off"
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-3 pl-10 pr-10 text-sm text-[#e6e0e8] outline-none transition placeholder:text-[#948e9c] focus:border-[#d1bcff]/60 focus:ring-2 focus:ring-[#d1bcff]/10"
        />

        {isLoading && (
          <Loader2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#9a91a3]"
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-white/10 bg-[#17121f] shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {error ? (
            <div className="px-4 py-3 text-sm text-[#fb7185]">
              {error}
            </div>
          ) : !isLoading && suggestions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-[#9a91a3]">
              No locations found.
            </div>
          ) : (
            suggestions.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => handleSelect(location)}
                className="flex w-full items-start gap-3 border-b border-white/[0.06] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/[0.06] focus:bg-white/[0.06] focus:outline-none"
              >
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#fb7185]"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#e6e0e8]">
                    {location.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-[#9a91a3]">
                    {[
                      location.state,
                      location.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}