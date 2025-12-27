"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HourlyCard } from "./HourlyCard";
import { SunIcon } from "./WeatherIcon";
import { formatHourTime } from "@/lib/forecast-processor";

export function HourlyForecast({ forecastData, timezoneOffsetSeconds }) {
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
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <SunIcon className="w-4 h-4" />
          Hourly Forecast
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
        {forecastData?.list?.slice(0, 24).map((hour, idx) => (
          <HourlyCard
            key={idx}
            hourTime={formatHourTime(hour.dt, timezoneOffsetSeconds)}
            temp={hour.main.temp}
            weatherMain={hour.weather[0].main}
            isDay={new Date(hour.dt * 1000).getHours() >= 6 && new Date(hour.dt * 1000).getHours() < 18}
          />
        ))}
      </div>
    </div>
  );
}
