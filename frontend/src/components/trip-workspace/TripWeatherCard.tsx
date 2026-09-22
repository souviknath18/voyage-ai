import {
  CloudOff,
} from "lucide-react";

import WeatherIcon from "@/components/trip-workspace/WeatherIcon";

import {
  Card,
} from "@/components/ui";

import type {
  TripWeather,
} from "@/types/trip-workspace";

interface TripWeatherCardProps {
  weather: TripWeather | null;
}

export default function TripWeatherCard({
  weather,
}: TripWeatherCardProps) {
  if (!weather) {
    return (
      <Card className="flex h-full min-h-[220px] flex-col p-5">
        <p className="w-full text-left text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
          Local Weather
        </p>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <CloudOff className="h-6 w-6 text-[#7f8798]" />
          </div>

          <p className="mt-4 text-sm font-medium text-[#cbc4d2]">
            Forecast unavailable
          </p>

          <p className="mt-2 max-w-[180px] text-xs leading-5 text-[#7f8798]">
            Weather information could not be loaded right now.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col items-center justify-center p-5 text-center">
      <p className="w-full text-left text-[10px] font-semibold uppercase tracking-wider text-[#7f8798]">
        Local Weather
      </p>

      <WeatherIcon
        condition={weather.condition}
        size={42}
        className="mt-5 text-[#fcd34d]"
      />

      <p className="mt-2 text-3xl font-semibold text-[#e6e0e8]">
        {weather.temperature}°
      </p>

      <p className="mt-1 text-sm text-[#cbc4d2]">
        {weather.condition}
      </p>

      <p className="mt-2 text-xs text-[#948e9c]">
        {weather.note}
      </p>
    </Card>
  );
}