import { fetchWeatherData } from "@/lib/weather-api";
import {
  processDailyForecast,
  calculateMinMaxTemp,
  formatCityTime,
  formatHourTime,
} from "@/lib/forecast-processor";
import {
  getWeatherVideo,
  DEFAULT_CITY,
  HOURLY_FORECAST_LIMIT,
  SEVEN_DAY_FORECAST_LIMIT,
} from "@/lib/constants";
import { ErrorState } from "@/components/weather/ErrorState";
import { ForecastCard } from "@/components/weather/ForecastCard";
import { HourlyForecast } from "@/components/weather/HourlyForecast";
import { WindIcon, SunriseIcon, SunsetIcon, ActivityIcon, SunIcon, HumidityIcon, EyeIcon, ThermometerIcon } from "@/components/weather/WeatherIcon";

export const Hero = async ({ city = DEFAULT_CITY, units = "metric" }) => {
  let weatherData, forecastData;
  try {
    const data = await fetchWeatherData(city, units);
    weatherData = data.current;
    forecastData = data.forecast;
    var pollutionData = data.pollution;
  } catch (error) {
    return <ErrorState city={city} message={error.message} />;
  }

  const temperature = Math.round(weatherData.main.temp);
  const description = weatherData.weather[0].description;
  const cityName = weatherData.name;
  const weatherMain = weatherData.weather[0].main;
  const minMaxTemp = calculateMinMaxTemp(forecastData);
  const timezoneOffsetSeconds = weatherData.timezone;
  const { formattedDateTime } = formatCityTime(timezoneOffsetSeconds);
  const sevenDayForecasts = processDailyForecast(forecastData, SEVEN_DAY_FORECAST_LIMIT);
  const weatherVideo = getWeatherVideo(weatherMain);

  return (
    <main className="relative flex flex-col items-center justify-start bg-gray-900 min-h-screen text-white p-4 pt-20 md:pt-24">
      <video
        autoPlay loop muted playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-60"
        src={weatherVideo}
        type="video/webm"
      />

      <div className="relative z-10 w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 pb-10 px-2 sm:px-4">
        
        {/* Left Column: Main Weather & 7-Day Forecast */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Main Weather Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[300px] shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                <p className="text-sm text-gray-400 font-mono">{formattedDateTime.split(',')[1]}</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-black text-white leading-none">{cityName}</h2>
              </div>
            </div>
            
            <div className="flex flex-col items-center my-4">
              <span className="text-8xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
                {temperature}°
              </span>
              <div className="flex items-center gap-2 mt-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <WindIcon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-bold uppercase tracking-widest">{description}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
              <span>Low: {minMaxTemp?.min}°</span>
              <span>High: {minMaxTemp?.max}°</span>
            </div>
          </div>

          {/* 7-Day Forecast Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <ActivityIcon className="w-4 h-4" />
              7-Day Forecast
            </div>
            <div className="flex flex-col gap-1">
              {sevenDayForecasts.map((forecast, idx) => (
                <ForecastCard key={idx} {...forecast} units={units} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: Widgets Grid */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Top Widgets Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PollutionWidget data={pollutionData} />
            <SunWidget sunrise={weatherData.sys.sunrise} sunset={weatherData.sys.sunset} />
            <WindWidget speed={weatherData.wind.speed} deg={weatherData.wind.deg} units={units} />
          </div>

          {/* Hourly Forecast Row */}
          <HourlyForecast 
            forecastData={forecastData} 
            timezoneOffsetSeconds={timezoneOffsetSeconds} 
          />

          {/* Bottom Widgets Row: 8 widgets in 4x2 grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniWidget 
              title="Air Pollution" 
              value={["Good", "Fair", "Moderate", "Poor", "Very Poor"][(pollutionData?.list?.[0]?.main?.aqi || 2)-1]} 
              subtitle="Air quality is moderate."
              icon={<ActivityIcon className="w-4 h-4 text-white" />} 
            />
            <MiniWidget 
              title="Sunset" 
              value={new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              subtitle={`Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              icon={<SunsetIcon className="w-4 h-4 text-orange-400" />} 
            />
            <MiniWidget 
              title="Wind" 
              value={units === "metric" ? `${Math.round(weatherData.wind.speed * 3.6)} km/h` : `${Math.round(weatherData.wind.speed)} mph`} 
              subtitle="Current wind speed."
              icon={<WindIcon className="w-4 h-4 text-blue-400" />} 
            />
            <MiniWidget 
              title="Humidity" 
              value={`${weatherData.main.humidity}%`} 
              subtitle="The dew point is 15 right now."
              icon={<HumidityIcon className="w-4 h-4 text-blue-300" />} 
            />
            <MiniWidget 
              title="Visibility" 
              value={`${(weatherData.visibility / 1000).toFixed(1)} km`} 
              subtitle="Visibility is good."
              icon={<EyeIcon className="w-4 h-4 text-cyan-300" />} 
            />
            <MiniWidget 
              title="Feels Like" 
              value={`${Math.round(weatherData.main.feels_like)}°`} 
              subtitle="Similar to the actual temperature."
              icon={<ThermometerIcon className="w-4 h-4 text-orange-400" />} 
            />
            <MiniWidget 
              title="Pressure" 
              value={`${weatherData.main.pressure} hPa`} 
              subtitle="Current air pressure."
              icon={<ActivityIcon className="w-4 h-4 text-green-400" />} 
            />
            <MiniWidget 
              title="UV Index" 
              value="4" 
              subtitle="Moderate UV levels."
              icon={<SunIcon className="w-4 h-4 text-yellow-400" />} 
            />
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Widgets
const MiniWidget = ({ title, value, icon, subtitle }) => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between min-h-[160px] shadow-2xl hover:border-white/20 transition-all">
    <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
      {icon}
      {title}
    </div>
    <div className="flex flex-col gap-1">
      <div className="text-3xl font-black text-white">{value}</div>
      {subtitle && <div className="text-xs font-semibold text-gray-400 leading-tight">{subtitle}</div>}
    </div>
  </div>
);

const PollutionWidget = ({ data }) => {
  const aqi = data?.list?.[0]?.main?.aqi || 2;
  const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi-1];
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[160px]">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Air Pollution</div>
      <div className="mt-4">
        <div className="w-full h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 relative">
           <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-black" style={{ left: `${(aqi/5)*100}%` }}></div>
        </div>
        <p className="mt-4 text-white font-bold text-lg leading-tight">Air quality is {aqiText.toLowerCase()}.</p>
      </div>
    </div>
  );
};

const SunWidget = ({ sunrise, sunset }) => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl min-h-[160px] flex flex-col justify-between">
    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sunrise & Sunset</div>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <SunriseIcon className="w-6 h-6 text-orange-300" />
        <span className="text-2xl font-black text-white">{new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="flex items-center gap-3">
        <SunsetIcon className="w-6 h-6 text-orange-500" />
        <span className="text-2xl font-black text-white">{new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  </div>
);

const WindWidget = ({ speed, deg, units }) => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl min-h-[160px] flex flex-col justify-between relative overflow-hidden">
    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 relative z-10">Wind</div>
    <div className="flex items-center justify-between relative z-10">
      <div className="text-4xl font-black text-white">{Math.round(speed * (units === 'metric' ? 3.6 : 1))}{units === 'metric' ? 'km/h' : 'mph'}</div>
      <div className="w-16 h-16 rounded-full border-4 border-white/10 flex items-center justify-center relative">
         <div className="absolute top-0.5 text-[6px] font-bold text-gray-500">N</div>
         <div className="w-0.5 h-8 bg-blue-500 rounded-full" style={{ transform: `rotate(${deg}deg)` }}></div>
      </div>
    </div>
  </div>
);
