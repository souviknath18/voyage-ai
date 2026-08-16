"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import SavedPlacesFilters from "@/components/saved-places/SavedPlacesFilters";
import SavedPlacesGrid from "@/components/saved-places/SavedPlacesGrid";
import SavedPlacesHeader from "@/components/saved-places/SavedPlacesHeader";
import SavedPlacesSelectionBar from "@/components/saved-places/SavedPlacesSelectionBar";

import type {
  SavedPlace,
  SavedPlaceCategory,
} from "@/types/saved-places";

const initialSavedPlaces: SavedPlace[] = [
  {
    id:
      "place-teamlab",

    name:
      "teamLab Borderless",

    city:
      "Tokyo",

    country:
      "Japan",

    description:
      "Immersive digital art museum combining light, sound and interactive technology.",

    image:
      "/images/places/teamlab.jpg",

    category:
      "technology",

    categoryLabel:
      "Technology",

    savedDate:
      "Aug 12",

    rating:
      4.8,
  },

  {
    id:
      "place-shibuya",

    name:
      "Shibuya Sky",

    city:
      "Tokyo",

    country:
      "Japan",

    description:
      "Open-air observation deck offering panoramic views across Tokyo and unforgettable sunset photography.",

    image:
      "/images/places/shibuya-sky.jpg",

    category:
      "technology",

    categoryLabel:
      "City Experience",

    savedDate:
      "Aug 13",

    rating:
      4.7,
  },

  {
    id:
      "place-tsukiji",

    name:
      "Tsukiji Outer Market",

    city:
      "Tokyo",

    country:
      "Japan",

    description:
      "Bustling food district known for seafood, sushi, street food and traditional Japanese flavors.",

    image:
      "/images/places/tsukiji.jpg",

    category:
      "food",

    categoryLabel:
      "Food",

    savedDate:
      "Aug 14",

    rating:
      4.5,
  },

  {
    id:
      "saved-kyoto",

    name:
      "Fushimi Inari Shrine",

    city:
      "Kyoto",

    country:
      "Japan",

    description:
      "Historic Shinto shrine famous for thousands of vermilion torii gates climbing Mount Inari.",

    image:
      "/images/places/fushimi-inari.jpg",

    category:
      "culture",

    categoryLabel:
      "Culture",

    savedDate:
      "Aug 10",

    rating:
      4.8,
  },

  {
    id:
      "saved-zermatt",

    name:
      "Matterhorn Glacier Paradise",

    city:
      "Zermatt",

    country:
      "Switzerland",

    description:
      "High-altitude Alpine experience with panoramic mountain views and year-round glacier scenery.",

    image:
      "/images/places/matterhorn.jpg",

    category:
      "adventure",

    categoryLabel:
      "Adventure",

    savedDate:
      "Aug 08",

    rating:
      4.7,
  },

  {
    id:
      "saved-monteverde",

    name:
      "Monteverde Cloud Forest",

    city:
      "Monteverde",

    country:
      "Costa Rica",

    description:
      "Protected tropical cloud forest filled with rare wildlife, elevated trails and rich biodiversity.",

    image:
      "/images/places/monteverde-cloud.jpg",

    category:
      "nature",

    categoryLabel:
      "Nature",

    savedDate:
      "Aug 05",

    rating:
      4.8,
  },
];

export default function SavedPlacesPage() {
  const router =
    useRouter();

  const [
    places,
    setPlaces,
  ] = useState<
    SavedPlace[]
  >(
    initialSavedPlaces,
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] =
    useState<SavedPlaceCategory>(
      "all",
    );

  const [
    selectedIds,
    setSelectedIds,
  ] = useState<
    string[]
  >([]);

  const visiblePlaces =
    useMemo(() => {
      let result =
        places;

      if (
        category !== "all"
      ) {
        result =
          result.filter(
            (place) =>
              place.category ===
              category,
          );
      }

      if (
        search.trim()
      ) {
        const query =
          search
            .trim()
            .toLowerCase();

        result =
          result.filter(
            (place) =>
              place.name
                .toLowerCase()
                .includes(
                  query,
                ) ||
              place.city
                .toLowerCase()
                .includes(
                  query,
                ) ||
              place.country
                .toLowerCase()
                .includes(
                  query,
                ),
          );
      }

      return result;
    }, [
      places,
      category,
      search,
    ]);

  const handleSelect = (
    id: string,
  ) => {
    setSelectedIds(
      (previous) =>
        previous.includes(
          id,
        )
          ? previous.filter(
              (item) =>
                item !== id,
            )
          : [
              ...previous,
              id,
            ],
    );
  };

  const handleRemove = (
    id: string,
  ) => {
    setPlaces(
      (previous) =>
        previous.filter(
          (place) =>
            place.id !== id,
        ),
    );

    setSelectedIds(
      (previous) =>
        previous.filter(
          (item) =>
            item !== id,
        ),
    );
  };

  const handleDetails = (
    id: string,
  ) => {
    /*
     * Global Saved Places is
     * not necessarily attached
     * to a specific trip.
     *
     * Later create:
     *
     * /places/[placeId]
     */
    router.push(
      `/places/${id}`,
    );
  };

  const handleCreateTrip =
    () => {
      const selectedPlaces =
        places.filter(
          (place) =>
            selectedIds.includes(
              place.id,
            ),
        );

      console.log(
        "Create trip around:",
        selectedPlaces,
      );

      /*
       * Later:
       *
       * router.push(
       *   `/plan-trip?places=...`
       * )
       */

      router.push(
        "/plan-trip",
      );
    };

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-24 md:px-6">
        <div className="space-y-6">
          <SavedPlacesHeader
            search={
              search
            }
            onSearchChangeAction={
              setSearch
            }
          />

          <SavedPlacesFilters
            activeCategory={
              category
            }
            onChangeAction={
              setCategory
            }
          />

          <SavedPlacesGrid
            places={
              visiblePlaces
            }
            selectedIds={
              selectedIds
            }
            onSelectAction={
              handleSelect
            }
            onRemoveAction={
              handleRemove
            }
            onDetailsAction={
              handleDetails
            }
          />
        </div>
      </div>

      <SavedPlacesSelectionBar
        count={
          selectedIds.length
        }
        onClearAction={() =>
          setSelectedIds(
            [],
          )
        }
        onCreateTripAction={
          handleCreateTrip
        }
      />
    </AppLayout>
  );
}