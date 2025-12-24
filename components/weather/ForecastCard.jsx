import { RainIcon, CloudIcon } from "./WeatherIcon";

export function ForecastCard({
  day,
  avgTemp,
  description,
  rainChance,
  cloudChance,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-gray-700 rounded-lg sm:rounded-2xl p-2 sm:p-3 text-center flex flex-col items-center">
      <p className="text-xs sm:text-sm font-semibold text-gray-300 mb-1">
        {day}
      </p>
      <p className="text-base font-bold text-white mb-1">{avgTemp}°</p>
      <p className="text-xs text-gray-400 capitalize mb-1">{description}</p>
      <div className="flex gap-2">
        <span className="flex items-center text-blue-400 text-xs">
          <RainIcon className="w-5 h-5 mr-1" />
          {rainChance}%
        </span>
        <span className="flex items-center text-gray-300 text-xs">
          <CloudIcon className="w-5 h-5 mr-1" />
          {cloudChance}%
        </span>
      </div>
    </div>
  );
}
