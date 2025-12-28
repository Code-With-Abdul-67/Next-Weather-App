import { RainIcon, CloudIcon, SunIcon, MoonIcon } from "./WeatherIcon";

export function HourlyCard({ hourTime, temp, weatherMain, isDay, units, isNow }) {
  const main = weatherMain ? weatherMain.toLowerCase() : "";

  return (
    <div className={`flex flex-col items-center justify-between p-3 min-w-[100px] flex-shrink-0 rounded-2xl transition-all border group ${isNow ? 'bg-white/20 border-white/30 scale-105 shadow-xl' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
      <p className={`text-xs font-semibold mb-2 uppercase tracking-tighter ${isNow ? 'text-white' : 'text-gray-400'}`}>
        {isNow ? "Now" : hourTime}
      </p>
      
      <div className="mb-2 group-hover:scale-110 transition-transform duration-300">
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
      
      <p className="text-lg font-medium text-white">{Math.round(temp)}°</p>
    </div>
  );
}
