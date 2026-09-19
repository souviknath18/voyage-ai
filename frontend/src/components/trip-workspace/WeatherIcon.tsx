import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";

interface WeatherIconProps {
  condition: string;
  size?: number;
  className?: string;
}

export default function WeatherIcon({
  condition,
  size = 20,
  className,
}: WeatherIconProps) {
  const value =
    condition.toLowerCase();

  if (
    value.includes("thunder")
  ) {
    return (
      <CloudLightning
        size={size}
        className={className}
      />
    );
  }

  if (
    value.includes("snow")
  ) {
    return (
      <CloudSnow
        size={size}
        className={className}
      />
    );
  }

  if (
    value.includes("drizzle")
  ) {
    return (
      <CloudDrizzle
        size={size}
        className={className}
      />
    );
  }

  if (
    value.includes("rain") ||
    value.includes("shower")
  ) {
    return (
      <CloudRain
        size={size}
        className={className}
      />
    );
  }

  if (
    value.includes("fog")
  ) {
    return (
      <CloudFog
        size={size}
        className={className}
      />
    );
  }

  if (
    value.includes("partly") ||
    value.includes("mainly clear")
  ) {
    return (
      <CloudSun
        size={size}
        className={className}
      />
    );
  }

  if (
    value.includes("cloud") ||
    value.includes("overcast")
  ) {
    return (
      <Cloud
        size={size}
        className={className}
      />
    );
  }

  return (
    <Sun
      size={size}
      className={className}
    />
  );
}