import { RainIcon, CloudIcon, SunIcon, MoonIcon } from "./WeatherIcon";

export function ForecastCard({
  day,
  minTemp,
  maxTemp,
  description,
  units,
}) {
  const main = description.toLowerCase();
  
  return (
    <div className="flex items-center justify-between w-full py-3 border-b border-white/5 last:border-none group">
      <p className="text-sm sm:text-base font-bold text-gray-200 w-16">
        {day.split(',')[0]}
      </p>
      
      <div className="flex items-center justify-center flex-1">
        {main.includes("rain") ? (
          <RainIcon className="w-6 h-6" />
        ) : main.includes("cloud") ? (
          <CloudIcon className="w-6 h-6" />
        ) : (
          <SunIcon className="w-6 h-6" />
        )}
      </div>

      <div className="flex items-center justify-end gap-4 w-32">
        <span className="text-sm font-semibold text-gray-400 w-10 text-right">{minTemp}°</span>
        <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 opacity-50 relative min-w-[60px]">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-[1px]"></div>
        </div>
        <span className="text-sm font-bold text-white w-10 text-left">{maxTemp}°</span>
      </div>
    </div>
  );
}
