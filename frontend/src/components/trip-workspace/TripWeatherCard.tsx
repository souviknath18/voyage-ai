import WeatherIcon from "@/components/trip-workspace/WeatherIcon";

import {
  Card,
} from "@/components/ui";

import type {
  TripWeather,
} from "@/types/trip-workspace";

interface TripWeatherCardProps {
  weather: TripWeather;
}

export default function TripWeatherCard({
  weather,
}: TripWeatherCardProps) {
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