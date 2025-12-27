import { RainIcon, CloudIcon, SunIcon, MoonIcon } from "./WeatherIcon";

export function HourlyCard({ hourTime, temp, weatherMain, isDay, units }) {
  const main = weatherMain ? weatherMain.toLowerCase() : "";

  return (
    <div className="flex flex-col items-center justify-between p-3 min-w-[100px] flex-shrink-0 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
      <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-tighter">
        {hourTime.split(' ')[0]}
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
      
      <p className="text-lg font-black text-white">{Math.round(temp)}°</p>
    </div>
  );
}
