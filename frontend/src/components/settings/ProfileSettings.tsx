"use client";

import {
  Camera,
  MapPin,
  Plane,
  UserRound,
} from "lucide-react";

import {
  Card,
  Input,
} from "@/components/ui";

interface ProfileSettingsProps {
  fullName: string;
  email: string;
  phone: string;
  homeCity: string;
  preferredAirport: string;

  onChangeAction: (
    field:
      | "fullName"
      | "email"
      | "phone"
      | "homeCity"
      | "preferredAirport",
    value: string,
  ) => void;
}

export default function ProfileSettings({
  fullName,
  email,
  phone,
  homeCity,
  preferredAirport,
  onChangeAction,
}: ProfileSettingsProps) {
  return (
    <section
      id="profile"
      className="scroll-mt-24"
    >
      <div className="mb-3 flex items-center gap-2">
        <UserRound
          size={16}
          className="text-[#d1bcff]"
        />

        <h2 className="text-base font-semibold text-[#e6e0e8]">
          Profile
        </h2>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Avatar */}
          <button
            type="button"
            className="group relative mx-auto flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#fb7185]/30 bg-gradient-to-br from-[#1b2135] to-[#24152c] text-[#d1bcff] sm:mx-0"
          >
            <UserRound
              size={29}
            />

            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 opacity-0 transition group-hover:opacity-100">
              <Camera
                size={17}
                className="text-white"
              />
            </span>
          </button>

          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2">
            <Input
              value={fullName}
              onChange={(event) =>
                onChangeAction(
                  "fullName",
                  event.target.value,
                )
              }
              placeholder="Full name"
            />

            <Input
              value={email}
              onChange={(event) =>
                onChangeAction(
                  "email",
                  event.target.value,
                )
              }
              placeholder="Email address"
              type="email"
            />

            <Input
              value={phone}
              onChange={(event) =>
                onChangeAction(
                  "phone",
                  event.target.value,
                )
              }
              placeholder="Phone number"
            />

            <Input
              value={homeCity}
              onChange={(event) =>
                onChangeAction(
                  "homeCity",
                  event.target.value,
                )
              }
              placeholder="Home city"
              leftIcon={
                <MapPin size={14} />
              }
            />

            <div className="md:col-span-2">
              <Input
                value={
                  preferredAirport
                }
                onChange={(event) =>
                  onChangeAction(
                    "preferredAirport",
                    event.target.value,
                  )
                }
                placeholder="Preferred airport"
                leftIcon={
                  <Plane size={14} />
                }
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}