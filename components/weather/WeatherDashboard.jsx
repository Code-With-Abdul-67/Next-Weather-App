"use client";

import { useState, useMemo } from "react";
import { formatHourTime, getCityTime, interpolateHourlyData } from "@/lib/forecast-processor";
import { 
  WindIcon, 
  SunriseIcon, 
  SunsetIcon, 
  ActivityIcon, 
  SunIcon, 
  HumidityIcon, 
  EyeIcon, 
  ThermometerIcon 
} from "@/components/weather/WeatherIcon";
import { ForecastCard } from "@/components/weather/ForecastCard";
import { HourlyForecast } from "@/components/weather/HourlyForecast";

export function WeatherDashboard({ 
  weatherData, 
  forecastData, 
  pollutionData, 
  sevenDayForecasts, 
  timezoneOffsetSeconds,
  units,
  cityName,
  formattedDateTime,
  temperature,
  description,
  minMaxTemp
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Pre-process all hourly data to interpolate 1-hour segments
  const allHourlyData = useMemo(() => {
    if (!forecastData?.list || !weatherData) return [];
    
    // Prepend current weather to the list as a "Now" point
    const nowPoint = {
      dt: Math.round(Date.now() / 1000),
      main: weatherData.main,
      weather: weatherData.weather,
      clouds: weatherData.clouds,
      wind: weatherData.wind,
      pop: forecastData.list[0]?.pop || 0
    };

    // Combine current with forecast and fill gaps
    // If the next forecast is less than 30 mins away, skip the nowPoint to avoid redundancy
    const firstForecast = forecastData.list[0];
    const nowTs = Math.round(Date.now() / 1000);
    const timeDiffToFirst = (firstForecast?.dt || 0) - nowTs;
    
    const baseList = timeDiffToFirst < 1800 ? forecastData.list : [nowPoint, ...forecastData.list];
    return interpolateHourlyData(baseList);
  }, [forecastData, weatherData]);

  // Filter hourly forecast based on selected day
  const filteredHourlyData = useMemo(() => {
    const selectedDay = sevenDayForecasts[selectedDayIndex];
    if (!selectedDay || !allHourlyData.length) return [];

    return allHourlyData.filter(item => {
      const cityTime = getCityTime(item.dt, timezoneOffsetSeconds);
      const dateKey = `${cityTime.getFullYear()}-${cityTime.getMonth() + 1}-${cityTime.getDate()}`;
      return dateKey === selectedDay.dateKey;
    });
  }, [selectedDayIndex, allHourlyData, sevenDayForecasts, timezoneOffsetSeconds]);

  // Calculate summaries for the selected day
  const dayMetrics = useMemo(() => {
    if (!filteredHourlyData.length) return null;

    // Use current weather for Day 0 (today) if available for better accuracy
    if (selectedDayIndex === 0 && weatherData) {
      const aqi = pollutionData?.list?.[0]?.main?.aqi || 2;
      return {
        aqi,
        aqiText: ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1],
        sunrise: weatherData.sys.sunrise,
        sunset: weatherData.sys.sunset,
        windSpeed: weatherData.wind.speed,
        windDeg: weatherData.wind.deg,
        humidity: weatherData.main.humidity,
        visibility: weatherData.visibility,
        feelsLike: weatherData.main.feels_like,
        pressure: weatherData.main.pressure,
        uvIndex: "4", // Static UV as API doesn't provide future
      };
    }

    // For future days, average the hourly data
    const count = filteredHourlyData.length;
    const sums = filteredHourlyData.reduce((acc, curr) => ({
      windSpeed: acc.windSpeed + curr.wind.speed,
      windDeg: acc.windDeg + curr.wind.deg,
      humidity: acc.humidity + curr.main.humidity,
      visibility: acc.visibility + curr.visibility,
      feelsLike: acc.feelsLike + curr.main.feels_like,
      pressure: acc.pressure + curr.main.pressure,
    }), { windSpeed: 0, windDeg: 0, humidity: 0, visibility: 0, feelsLike: 0, pressure: 0 });

    // Find first pollution entry for the selected day
    const selectedDay = sevenDayForecasts[selectedDayIndex];
    const dayAqiEntry = pollutionData?.list?.find(p => {
        const pTime = getCityTime(p.dt, timezoneOffsetSeconds);
        return `${pTime.getFullYear()}-${pTime.getMonth() + 1}-${pTime.getDate()}` === selectedDay.dateKey;
    });
    const aqi = dayAqiEntry?.main?.aqi || 2;

    return {
      aqi,
      aqiText: ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1],
      sunrise: forecastData.city.sunrise, // Use city fixed sunset/sunrise for future
      sunset: forecastData.city.sunset,
      windSpeed: sums.windSpeed / count,
      windDeg: sums.windDeg / count,
      humidity: Math.round(sums.humidity / count),
      visibility: sums.visibility / count,
      feelsLike: sums.feelsLike / count,
      pressure: Math.round(sums.pressure / count),
      uvIndex: "N/A", // UV not in future forecast API
    };
  }, [selectedDayIndex, filteredHourlyData, weatherData, pollutionData, forecastData, sevenDayForecasts, timezoneOffsetSeconds]);

  const selectedDayLabel = sevenDayForecasts[selectedDayIndex]?.day || "Hourly Forecast";

  return (
    <div 
      className="relative z-10 w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2 md:-mt-4 pb-10 px-2 sm:px-4 min-h-screen"
      onClick={() => setSelectedDayIndex(0)}
    >
      
      {/* Left Column: Main Weather & 7-Day Forecast */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        {/* Main Weather Card */}
        <div 
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[300px] shadow-2xl transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{formattedDateTime.split(',')[0]}</h3>
              <p className="text-sm text-gray-400">{formattedDateTime.split(',')[1]}</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold text-white leading-none">{cityName}</h2>
            </div>
          </div>
          
          <div className="flex flex-col items-center my-4">
            <span className="text-8xl font-medium text-white leading-none tracking-tighter drop-shadow-2xl">
              {selectedDayIndex === 0 ? temperature : Math.round(dayMetrics?.feelsLike || 0)}°
            </span>
            <div className="flex items-center gap-2 mt-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <WindIcon className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-bold uppercase tracking-widest">
                {selectedDayIndex === 0 ? description : sevenDayForecasts[selectedDayIndex]?.description}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
            <span>Low: {selectedDayIndex === 0 ? minMaxTemp?.min : sevenDayForecasts[selectedDayIndex]?.minTemp}°</span>
            <span>High: {selectedDayIndex === 0 ? minMaxTemp?.max : sevenDayForecasts[selectedDayIndex]?.maxTemp}°</span>
          </div>
        </div>

        {/* 7-Day Forecast Card */}
        <div 
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all"
        >
          <div className="flex items-center gap-2 mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            <ActivityIcon className="w-4 h-4" />
            5-Day Forecast
          </div>
          <div className="flex flex-col gap-1">
            {sevenDayForecasts.map((forecast, idx) => (
              <ForecastCard 
                key={idx} 
                {...forecast} 
                units={units} 
                isActive={selectedDayIndex === idx && selectedDayIndex !== 0} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDayIndex(selectedDayIndex === idx ? 0 : idx);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Columns: Widgets Grid */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        
        {/* Top Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PollutionWidget aqi={dayMetrics?.aqi || 2} aqiText={dayMetrics?.aqiText || "Moderate"} />
          <SunWidget sunrise={dayMetrics?.sunrise} sunset={dayMetrics?.sunset} timezone={timezoneOffsetSeconds} />
          <WindWidget speed={dayMetrics?.windSpeed || 0} deg={dayMetrics?.windDeg || 0} units={units} />
        </div>

        {/* Hourly Forecast Row */}
        <div onClick={(e) => e.stopPropagation()}>
          <HourlyForecast 
            hourlyData={filteredHourlyData} 
            timezoneOffsetSeconds={timezoneOffsetSeconds} 
            title={selectedDayIndex === 0 ? "Today's Forecast" : `${selectedDayLabel} Forecast`}
            showNowHighlight={selectedDayIndex === 0}
          />
        </div>

        {/* Bottom Widgets Row: 8 widgets in 4x2 grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniWidget 
            title="Air Pollution" 
            value={dayMetrics?.aqiText || "Moderate"} 
            subtitle={selectedDayIndex === 0 ? "Air quality is moderate." : `Forecasted for ${selectedDayLabel}`}
            icon={<ActivityIcon className="w-4 h-4 text-white" />} 
          />
          <MiniWidget 
            title="Sunset" 
            value={dayMetrics?.sunset ? formatHourTime(dayMetrics.sunset, timezoneOffsetSeconds) : "--:--"} 
            subtitle={`Sunrise: ${dayMetrics?.sunrise ? formatHourTime(dayMetrics.sunrise, timezoneOffsetSeconds) : "--:--"}`}
            icon={<SunsetIcon className="w-4 h-4 text-orange-400" />} 
          />
          <MiniWidget 
            title="Wind" 
            value={units === "metric" ? `${Math.round((dayMetrics?.windSpeed || 0) * 3.6)} km/h` : `${Math.round(dayMetrics?.windSpeed || 0)} mph`} 
            subtitle="Estimated wind speed."
            icon={<WindIcon className="w-4 h-4 text-blue-400" />} 
          />
          <MiniWidget 
            title="Humidity" 
            value={`${dayMetrics?.humidity || 0}%`} 
            subtitle={`Avg humidity for ${selectedDayLabel}.`}
            icon={<HumidityIcon className="w-4 h-4 text-blue-300" />} 
          />
          <MiniWidget 
            title="Visibility" 
            value={`${((dayMetrics?.visibility || 0) / 1000).toFixed(1)} km`} 
            subtitle="Average visibility."
            icon={<EyeIcon className="w-4 h-4 text-cyan-300" />} 
          />
          <MiniWidget 
            title="Feels Like" 
            value={`${Math.round(dayMetrics?.feelsLike || 0)}°`} 
            subtitle="Similar to the actual temperature."
            icon={<ThermometerIcon className="w-4 h-4 text-orange-400" />} 
          />
          <MiniWidget 
            title="Pressure" 
            value={`${dayMetrics?.pressure || 0} hPa`} 
            subtitle="Atmospheric pressure."
            icon={<ActivityIcon className="w-4 h-4 text-green-400" />} 
          />
          <MiniWidget 
            title="UV Index" 
            value={dayMetrics?.uvIndex || "N/A"} 
            subtitle={selectedDayIndex === 0 ? "Moderate UV levels." : "Not available in forecast."}
            icon={<SunIcon className="w-4 h-4 text-yellow-400" />} 
          />
        </div>
      </div>
    </div>
  );
}

// Helper Widgets
const MiniWidget = ({ title, value, icon, subtitle }) => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between min-h-[160px] shadow-2xl hover:border-white/20 transition-all">
    <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
      {icon}
      {title}
    </div>
    <div className="flex flex-col gap-1">
      <div className="text-3xl font-semibold text-white">{value}</div>
      {subtitle && <div className="text-xs font-normal text-gray-400 leading-tight">{subtitle}</div>}
    </div>
  </div>
);

const PollutionWidget = ({ aqi, aqiText }) => {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[160px]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Air Pollution</div>
      <div className="mt-4">
        <div className="w-full h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 relative">
           <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-black" style={{ left: `${(aqi/5)*100}%` }}></div>
        </div>
        <p className="mt-4 text-white font-bold text-lg leading-tight">Air quality is {aqiText.toLowerCase()}.</p>
      </div>
    </div>
  );
};

const SunWidget = ({ sunrise, sunset, timezone }) => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl min-h-[160px] flex flex-col justify-between">
    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sunrise & Sunset</div>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <SunriseIcon className="w-6 h-6 text-orange-300" />
        <span className="text-2xl font-semibold text-white">{formatHourTime(sunrise, timezone)}</span>
      </div>
      <div className="flex items-center gap-3">
        <SunsetIcon className="w-6 h-6 text-orange-500" />
        <span className="text-2xl font-semibold text-white">{formatHourTime(sunset, timezone)}</span>
      </div>
    </div>
  </div>
);

const WindWidget = ({ speed, deg, units }) => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl min-h-[160px] flex flex-col justify-between relative overflow-hidden">
    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 relative z-10">Wind</div>
    <div className="flex items-center justify-between relative z-10">
      <div className="text-4xl font-semibold text-white">{Math.round(speed * (units === 'metric' ? 3.6 : 1))}{units === 'metric' ? 'km/h' : 'mph'}</div>
      <div className="w-16 h-16 rounded-full border-4 border-white/10 flex items-center justify-center relative">
         <div className="absolute top-0.5 text-[6px] font-semibold text-gray-500">N</div>
         <div className="w-0.5 h-8 bg-blue-500 rounded-full" style={{ transform: `rotate(${deg}deg)` }}></div>
      </div>
    </div>
  </div>
);
