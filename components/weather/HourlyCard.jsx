import { RainIcon, CloudIcon, SunIcon, MoonIcon, HumidityIcon } from "./WeatherIcon";

export function HourlyCard({ hourTime, temp, humidity, weatherMain, isDay, units }) {
  const main = weatherMain ? weatherMain.toLowerCase() : "";

  return (
    <div className="bg-black/30 backdrop-blur-md border border-gray-700 rounded-lg sm:rounded-2xl p-2 sm:p-3 text-center hover:bg-white/20 hover:scale-105 transition-all duration-300 flex flex-col items-center">
      <p className="text-xs sm:text-sm font-semibold text-gray-300 mb-1">
        {hourTime}
      </p>
      
      <div className="flex items-center justify-center mb-1">
        {main.includes("rain") ? (
          <RainIcon className="w-8 h-8" />
        ) : main.includes("cloud") ? (
          <CloudIcon className="w-8 h-8" />
        ) : isDay ? (
          <SunIcon className="w-8 h-8" />
        ) : (
          <MoonIcon className="w-8 h-8" />
        )}
      </div>
      
      <p className="text-lg font-bold text-white mb-1">{Math.round(temp)}°{units === "imperial" ? "F" : ""}</p>
      
      <div className="flex items-center justify-center gap-1 text-xs text-blue-300">
        <HumidityIcon className="w-4 h-4" />
        {humidity}%
      </div>
      
      {main.includes("rain") && (
        <div className="flex items-center justify-center gap-1 text-xs text-blue-400 mt-1">
          <RainIcon className="w-4 h-4" />
          Rain
        </div>
      )}
    </div>
  );
}
