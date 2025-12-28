"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HourlyCard } from "./HourlyCard";
import { SunIcon } from "./WeatherIcon";
import { formatHourTime, getCityTime } from "@/lib/forecast-processor";

export function HourlyForecast({ hourlyData, timezoneOffsetSeconds, title = "Hourly Forecast", showNowHighlight = true }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
          <SunIcon className="w-4 h-4" />
          {title}
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all shadow-lg backdrop-blur-md"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all shadow-lg backdrop-blur-md"
            aria-label="Scroll Right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar scroll-smooth"
      >
        {hourlyData && hourlyData.length > 0 ? (
          hourlyData.map((hour, idx) => {
            const cityTime = getCityTime(hour.dt, timezoneOffsetSeconds);
            const cityHour = cityTime.getHours();
            
            // Check if this is the "Now" block (current hour)
            const cityNow = getCityTime(Date.now() / 1000, timezoneOffsetSeconds);
            const isNow = showNowHighlight && 
                          cityTime.getHours() === cityNow.getHours() && 
                          cityTime.getDate() === cityNow.getDate() &&
                          cityTime.getMonth() === cityNow.getMonth();

            return (
              <HourlyCard
                key={idx}
                hourTime={formatHourTime(hour.dt, timezoneOffsetSeconds)}
                temp={hour.main.temp}
                weatherMain={hour.weather[0].main}
                isDay={cityHour >= 6 && cityHour < 18}
                isNow={isNow}
              />
            );
          })
        ) : (
          <div className="flex items-center justify-center w-full py-10 text-gray-500 font-bold uppercase tracking-widest text-xs">
            No hourly data available for this day
          </div>
        )}
      </div>
    </div>
  );
}
