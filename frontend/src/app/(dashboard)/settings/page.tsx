"use client";

import {
  useState,
} from "react";

import AppLayout from "@/components/layout/AppLayout";

import AccountSettings from "@/components/settings/AccountSettings";
import LocalizationSettings from "@/components/settings/LocalizationSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsNavigation from "@/components/settings/SettingsNavigation";
import TravelPreferencesSettings from "@/components/settings/TravelPreferencesSettings";

import {
  Button,
} from "@/components/ui";

import {
  Save,
} from "lucide-react";

import type {
  AccommodationPreference,
  SettingsData,
  TravelPace,
} from "@/types/settings";

const initialSettings: SettingsData = {
  fullName:
    "Souvik Nath",

  email:
    "souvik@example.com",

  phone: "",

  homeCity:
    "Bangalore",

  preferredAirport:
    "Kempegowda International Airport (BLR)",

  currency:
    "INR",

  region:
    "IN",

  travelPace:
    "balanced",

  accommodationPreferences: [
    "boutique",
  ],

  dietaryRequirement:
    "none",

  emailNotifications:
    true,

  tripUpdates:
    true,

  priceAlerts:
    true,

  weatherAlerts:
    true,

  aiActivityAlerts:
    true,

  marketingEmails:
    false,
};

export default function SettingsPage() {
  const [
    settings,
    setSettings,
  ] =
    useState<SettingsData>(
      initialSettings,
    );

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

  const handleSave =
    () => {
      console.log(
        "Settings:",
        settings,
      );

      /*
       * Later:
       *
       * PATCH /api/settings/
       */
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

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-24 md:px-6">
        <div className="space-y-6">
          <SettingsHeader
            onSaveAction={
              handleSave
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
          onClick={
            handleSave
          }
        >
          <Save size={15} />

          Save Changes
        </Button>
      </div>
    </AppLayout>
  );
}