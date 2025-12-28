import { RainIcon, CloudIcon, SunIcon, MoonIcon } from "./WeatherIcon";

export function ForecastCard({
  day,
  minTemp,
  maxTemp,
  description,
  units,
  onClick,
  isActive,
}) {
  const main = description.toLowerCase();
  
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full py-4 px-4 rounded-2xl transition-all duration-300 group ${
        isActive 
          ? "bg-white/15 border border-white/20 shadow-lg scale-[1.02]" 
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      <p className={`text-sm sm:text-base font-semibold w-16 text-left transition-colors ${
        isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
      }`}>
        {day.split(',')[0]}
      </p>
      
      <div className="flex items-center justify-center flex-1">
        {main.includes("rain") ? (
          <RainIcon className={`w-6 h-6 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
        ) : main.includes("cloud") ? (
          <CloudIcon className={`w-6 h-6 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
        ) : (
          <SunIcon className={`w-6 h-6 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
        )}
      </div>

      <div className="flex items-center justify-end gap-4 w-32">
        <span className={`text-sm font-medium w-10 text-right ${isActive ? "text-gray-300" : "text-gray-400"}`}>{minTemp}°</span>
        <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400 opacity-50 relative min-w-[60px]">
          <div className={`absolute inset-0 bg-white/20 rounded-full blur-[1px] ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}></div>
        </div>
        <span className={`text-sm font-semibold w-10 text-left ${isActive ? "text-white" : "text-gray-300"}`}>{maxTemp}°</span>
      </div>
    </button>
  );
}
