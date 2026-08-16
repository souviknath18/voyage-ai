"use client";

import {
  Globe2,
} from "lucide-react";

import {
  Card,
  Dropdown,
} from "@/components/ui";

interface LocalizationSettingsProps {
  currency: string;
  region: string;

  onCurrencyChangeAction: (
    value: string,
  ) => void;

  onRegionChangeAction: (
    value: string,
  ) => void;
}

const currencyOptions = [
  {
    label: "Indian Rupee (INR)",
    value: "INR",
  },
  {
    label: "US Dollar (USD)",
    value: "USD",
  },
  {
    label: "Euro (EUR)",
    value: "EUR",
  },
  {
    label: "British Pound (GBP)",
    value: "GBP",
  },
  {
    label: "Japanese Yen (JPY)",
    value: "JPY",
  },
];

const regionOptions = [
  {
    label: "India",
    value: "IN",
  },
  {
    label: "United States",
    value: "US",
  },
  {
    label: "United Kingdom",
    value: "GB",
  },
  {
    label: "Japan",
    value: "JP",
  },
  {
    label: "European Union",
    value: "EU",
  },
];

export default function LocalizationSettings({
  currency,
  region,
  onCurrencyChangeAction,
  onRegionChangeAction,
}: LocalizationSettingsProps) {
  return (
    <section
      id="localization"
      className="scroll-mt-24"
    >
      <div className="mb-3 flex items-center gap-2">
        <Globe2
          size={16}
          className="text-[#d1bcff]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Currency & Region
        </h2>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
              Preferred Currency
            </p>

            <Dropdown
              value={currency}
              options={
                currencyOptions
              }
              onChangeAction={
                onCurrencyChangeAction
              }
            />
          </div>

          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#7f8798]">
              Home Region
            </p>

            <Dropdown
              value={region}
              options={
                regionOptions
              }
              onChangeAction={
                onRegionChangeAction
              }
            />
          </div>
        </div>
      </Card>
    </section>
  );
}