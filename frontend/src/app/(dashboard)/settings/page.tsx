"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getCurrentUser,
  updateCurrentUser,
} from "@/lib/auth";

import {
  getUserSettings,
  updateUserSettings,
} from "@/lib/user-settings";

import {
  mapApiSettingsToFrontend,
  mapFrontendSettingsToApi,
} from "@/lib/user-settings-mapper";

import AppLayout from "@/components/layout/AppLayout";

import AccountSettings from "@/components/settings/AccountSettings";
import LocalizationSettings from "@/components/settings/LocalizationSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsPageSkeleton from "@/components/settings/SettingsPageSkeleton";
import SettingsNavigation from "@/components/settings/SettingsNavigation";
import TravelPreferencesSettings from "@/components/settings/TravelPreferencesSettings";

import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { useUnsavedChangesContext } from "@/contexts/UnsavedChangesContext";

import {
  Button,
} from "@/components/ui";

import {
  AlertCircle,
  RefreshCw,
  Save,
} from "lucide-react";

import type {
  AccommodationPreference,
  SettingsData,
  TravelPace,
} from "@/types/settings";

const initialSettings: SettingsData = {
  fullName: "",
  email: "",
  phone: "",
  homeCity: "",
  preferredAirport: "",
  currency: "INR",
  region: "IN",
  travelPace: "balanced",
  accommodationPreferences: [],
  dietaryRequirement: "none",
  emailNotifications: true,
  tripUpdates: true,
  priceAlerts: true,
  weatherAlerts: true,
  aiActivityAlerts: true,
  marketingEmails: false,
};

export default function SettingsPage() {
  const [
    settings,
    setSettings,
  ] =
    useState<SettingsData>(
      initialSettings,
    );

  const [savedSettings, setSavedSettings] =
    useState<SettingsData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [hasLoaded, setHasLoaded] =
    useState(false);

  const [retryCount, setRetryCount] =
    useState(0);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [savedProfile, setSavedProfile] =
    useState({
      fullName: "",
      email: "",
    });

  const settingsRef = useRef(settings);
  const saveInProgressRef = useRef(false);

  settingsRef.current = settings;

  const {
    setHasUnsavedChanges,
  } = useUnsavedChangesContext();

  
  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        setIsLoading(true);
        setHasLoaded(false);
        setSavedSettings(null);
        setError(null);
        setSuccess(null);

        const [apiSettings, user] =
          await Promise.all([
            getUserSettings(),
            getCurrentUser(),
          ]);

        if (cancelled) return;

        const profile = {
          fullName: user.full_name ?? "",
          email: user.email,
        };

        setSavedProfile(profile);

        const loadedSettings =
          mapApiSettingsToFrontend(
            apiSettings,
            profile,
          );

        setSettings(loadedSettings);
        setSavedSettings(loadedSettings);
        setHasLoaded(true);
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load settings.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);


  const updateField = <
    K extends keyof SettingsData,
  >(
    field: K,
    value:
      SettingsData[K],
  ) => {
    setSettings(
      (previous) => ({
        ...previous,
        [field]: value,
      }),
    );
  };

  const handleProfileChange = (
    field:
      | "fullName"
      | "email"
      | "phone"
      | "homeCity"
      | "preferredAirport",
    value: string,
  ) => {
    updateField(
      field,
      value,
    );
  };

  const handleAccommodationChange = (
    value:
      AccommodationPreference,
  ) => {
    setSettings(
      (previous) => {
        const selected =
          previous.accommodationPreferences.includes(
            value,
          );

        return {
          ...previous,

          accommodationPreferences:
            selected
              ? previous.accommodationPreferences.filter(
                  (item) =>
                    item !==
                    value,
                )
              : [
                  ...previous.accommodationPreferences,
                  value,
                ],
        };
      },
    );
  };

  const handleRetry = () => {
    setRetryCount((previous) => previous + 1);
  };
  
  const hasUnsavedChanges = useMemo(() => {
    if (!savedSettings) {
      return false;
    }

    const current =
      mapFrontendSettingsToApi(settings);

    const saved =
      mapFrontendSettingsToApi(savedSettings);

    const currentPreferences = {
      ...current,
      accommodation_preferences: [
        ...(current.accommodation_preferences ?? []),
      ].sort(),
    };

    const savedPreferences = {
      ...saved,
      accommodation_preferences: [
        ...(saved.accommodation_preferences ?? []),
      ].sort(),
    };

    return (
      JSON.stringify(currentPreferences) !==
        JSON.stringify(savedPreferences) ||
      settings.fullName !==
        savedSettings.fullName ||
      settings.email !== savedSettings.email
    );
  }, [settings, savedSettings]);

  useUnsavedChangesGuard({
    hasUnsavedChanges,
    isSaving,
  });

  useEffect(() => {
    setHasUnsavedChanges(
      hasUnsavedChanges && !isSaving,
    );
  }, [
    hasUnsavedChanges,
    isSaving,
    setHasUnsavedChanges,
  ]);

  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);
  
  const handleSave = async () => {
    if (
      saveInProgressRef.current ||
      isLoading ||
      !hasLoaded ||
      !hasUnsavedChanges ||
      !savedSettings
    ) {
      return;
    }

    saveInProgressRef.current = true;
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    // Snapshot the values being submitted.
    const submittedSettings: SettingsData = {
      ...settingsRef.current,
      accommodationPreferences: [
        ...settingsRef.current.accommodationPreferences,
      ],
    };

    let confirmedSettings: SettingsData = {
      ...savedSettings,
    };

    let preferencesSaved = false;
    let profileSaved = false;

    try {
      const preferencesPayload =
        mapFrontendSettingsToApi(submittedSettings);

      const savedPreferencesPayload =
        mapFrontendSettingsToApi(savedSettings);

      const normalizePreferences = (
        payload: ReturnType<
          typeof mapFrontendSettingsToApi
        >,
      ) =>
        JSON.stringify({
          ...payload,
          accommodation_preferences: [
            ...(payload.accommodation_preferences ?? []),
          ].sort(),
        });

      const preferencesChanged =
        normalizePreferences(preferencesPayload) !==
        normalizePreferences(savedPreferencesPayload);

      const fullNameChanged =
        submittedSettings.fullName !==
        savedSettings.fullName;

      if (preferencesChanged) {
        const response = await updateUserSettings(
          preferencesPayload,
        );

        confirmedSettings =
          mapApiSettingsToFrontend(response, {
            fullName: confirmedSettings.fullName,
            email: confirmedSettings.email,
          });

        preferencesSaved = true;
        setSavedSettings({
          ...confirmedSettings,
        });
      }

      if (fullNameChanged) {
        const updatedUser = await updateCurrentUser({
          full_name:
            submittedSettings.fullName.trim() || null,
        });

        confirmedSettings = {
          ...confirmedSettings,
          fullName: updatedUser.full_name ?? "",
          email: updatedUser.email,
        };

        profileSaved = true;

        setSavedProfile({
          fullName: updatedUser.full_name ?? "",
          email: updatedUser.email,
        });

        setSavedSettings({
          ...confirmedSettings,
        });
      }

      // Preserve any changes made after Save was clicked.
      setSettings((current) => {
        const next = { ...current };

        for (const key of Object.keys(
          submittedSettings,
        ) as (keyof SettingsData)[]) {
          const submittedValue = submittedSettings[key];
          const currentValue = current[key];

          const unchangedSinceSubmit =
            JSON.stringify(currentValue) ===
            JSON.stringify(submittedValue);

          if (unchangedSinceSubmit) {
            // Keep server-normalized values only for
            // fields whose submitted values were saved.
            if (
              key === "fullName" &&
              !profileSaved
            ) {
              continue;
            }

            if (key === "email") {
              continue;
            }

            if (
              key !== "fullName" &&
              !preferencesSaved
            ) {
              continue;
            }

            Object.assign(next, {
              [key]: confirmedSettings[key],
            });
          }
        }

        return next;
      });

      const hasNewerEdits =
        JSON.stringify(settingsRef.current) !==
        JSON.stringify(submittedSettings);

      setSuccess(
        hasNewerEdits
          ? "Changes saved. You have newer edits that still need saving."
          : "Settings saved successfully.",
      );
    } catch (err) {
      // Preserve every confirmed successful update.
      setSavedSettings({
        ...confirmedSettings,
      });

      const message =
        err instanceof Error
          ? err.message
          : "Failed to save settings.";

      setError(
        preferencesSaved || profileSaved
          ? `Some changes were saved, but another update failed: ${message}`
          : message,
      );
    } finally {
      saveInProgressRef.current = false;
      setIsSaving(false);
    }
  };


  const handleDelete =
    () => {
      console.log(
        "Delete account",
      );

      /*
       * Later:
       *
       * Open confirmation modal.
       */
    };
  
  
  if (isLoading) {
    return (
      <AppLayout>
        <SettingsPageSkeleton />
      </AppLayout>
    );
  }

  
  if (!hasLoaded) {
    return (
      <AppLayout>
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[1280px] items-center justify-center px-4 md:px-6">
          <div className="flex w-full max-w-md flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
              <AlertCircle
                size={26}
                className="text-red-400"
              />
            </div>

            <h2 className="text-xl font-semibold text-white">
              Unable to load settings
            </h2>

            <p
              role="alert"
              className="mt-2 text-sm leading-6 text-white/60"
            >
              {error ??
                "Something went wrong while loading your settings. Please try again."}
            </p>

            <Button
              onClick={handleRetry}
              className="mt-6"
            >
              <RefreshCw size={16} />
              Try Again
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-24 md:px-6">
        <div className="space-y-6">

          {error && (
            <p
              role="alert"
              className="text-sm text-red-400"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="text-sm text-emerald-400"
            >
              {success}
            </p>
          )}

          <SettingsHeader
            onSaveAction={handleSave}
            isSaving={isSaving}
            hasUnsavedChanges={
              hasLoaded && hasUnsavedChanges
            }
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            {/* Settings Navigation */}
            <SettingsNavigation />

            {/* Settings Sections */}
            <div className="min-w-0 space-y-8">
              <ProfileSettings
                fullName={
                  settings.fullName
                }
                email={
                  settings.email
                }
                phone={
                  settings.phone
                }
                homeCity={
                  settings.homeCity
                }
                preferredAirport={
                  settings.preferredAirport
                }
                onChangeAction={
                  handleProfileChange
                }
              />

              <TravelPreferencesSettings
                travelPace={
                  settings.travelPace
                }
                accommodationPreferences={
                  settings.accommodationPreferences
                }
                dietaryRequirement={
                  settings.dietaryRequirement
                }
                onTravelPaceChangeAction={(
                  value:
                    TravelPace,
                ) =>
                  updateField(
                    "travelPace",
                    value,
                  )
                }
                onAccommodationChangeAction={
                  handleAccommodationChange
                }
                onDietaryChangeAction={(
                  value,
                ) =>
                  updateField(
                    "dietaryRequirement",
                    value,
                  )
                }
              />

              <LocalizationSettings
                currency={
                  settings.currency
                }
                region={
                  settings.region
                }
                onCurrencyChangeAction={(
                  value,
                ) =>
                  updateField(
                    "currency",
                    value,
                  )
                }
                onRegionChangeAction={(
                  value,
                ) =>
                  updateField(
                    "region",
                    value,
                  )
                }
              />

              <NotificationSettings
                emailNotifications={
                  settings.emailNotifications
                }
                tripUpdates={
                  settings.tripUpdates
                }
                priceAlerts={
                  settings.priceAlerts
                }
                weatherAlerts={
                  settings.weatherAlerts
                }
                aiActivityAlerts={
                  settings.aiActivityAlerts
                }
                marketingEmails={
                  settings.marketingEmails
                }
                onChangeAction={(
                  field,
                  value,
                ) =>
                  updateField(
                    field,
                    value,
                  )
                }
              />

              <PrivacySettings />

              <AccountSettings
                onDeleteAction={
                  handleDelete
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Save */}
      <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
        <Button
          fullWidth
          onClick={handleSave}
          disabled={
            isLoading ||
            isSaving ||
            !hasLoaded ||
            !hasUnsavedChanges
          }
        >
          <Save size={15} />

          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </AppLayout>
  );
}