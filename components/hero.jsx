import { fetchWeatherData } from "@/lib/weather-api";
import {
  processDailyForecast,
  calculateMinMaxTemp,
  formatCityTime,
  formatHourTime,
} from "@/lib/forecast-processor";
import {
  getWeatherVideo,
  MS_TO_KMH,
  DEFAULT_CITY,
  HOURLY_FORECAST_LIMIT,
  SEVEN_DAY_FORECAST_LIMIT,
} from "@/lib/constants";
import { ErrorState } from "@/components/weather/ErrorState";
import { ForecastCard } from "@/components/weather/ForecastCard";
import { HourlyCard } from "@/components/weather/HourlyCard";
import { HumidityIcon, WindIcon } from "@/components/weather/WeatherIcon";

// Revalidate weather data every 10 minutes (600 seconds)
export const revalidate = 600;

export const Hero = async ({ city = DEFAULT_CITY }) => {
  // Fetch weather data with proper error handling
  let weatherData, forecastData;
  
  try {
    const data = await fetchWeatherData(city);
    weatherData = data.current;
    forecastData = data.forecast;
  } catch (error) {
    return <ErrorState city={city} message={error.message} />;
  }

  // Extract current weather data
  const temperature = Math.round(weatherData.main.temp);
  const description = weatherData.weather[0].description;
  const windSpeed = weatherData.wind.speed;
  const cityName = weatherData.name;
  const humidity = weatherData.main.humidity;
  const weatherMain = weatherData.weather[0].main;

  // Calculate min/max temperatures from forecast data
  const minMaxTemp = calculateMinMaxTemp(forecastData);
  const lowHigh = minMaxTemp
    ? `Low: ${minMaxTemp.min}° High: ${minMaxTemp.max}°`
    : `Low: ${temperature - 4}° High: ${temperature + 2}°`;

  // Format city time with timezone
  const timezoneOffsetSeconds = weatherData.timezone;
  const { formattedDateTime, formattedDate } = formatCityTime(timezoneOffsetSeconds);

  // Convert wind speed from m/s to km/h
  const windSpeedKmH = Math.round(windSpeed * MS_TO_KMH);

  // Process forecast data
  const sevenDayForecasts = processDailyForecast(forecastData, SEVEN_DAY_FORECAST_LIMIT);

  // Get weather video
  const weatherVideo = getWeatherVideo(weatherMain);

  return (
    <main className="relative flex flex-col items-center justify-start bg-gray-900 min-h-[120vh] text-white p-4 sm:p-6">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full min-h-screen min-w-full object-cover z-0"
        src={weatherVideo}
        type="video/webm"
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg flex flex-col items-center">
        {/* City Name */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          {cityName}
        </h2>

        {/* Date & Time */}
        <p className="text-sm text-gray-300 mb-2">
          {formattedDateTime}, {formattedDate}
        </p>

        {/* Weather Description */}
        <p className="text-base text-gray-400 mb-2 capitalize">{description}</p>

        {/* Temperature */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="flex items-center gap-2 text-5xl font-bold text-white">
            {temperature}°
            <WindIcon className="w-8 h-8 text-blue-400" />
          </span>
        </div>

        {/* Humidity & Wind Details */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <span className="flex items-center gap-1 text-base text-gray-300">
            <HumidityIcon className="w-5 h-5 text-blue-300" />
            Humidity:{" "}
            <span className="font-semibold text-blue-300">{humidity}%</span>
          </span>
          <span className="flex items-center gap-1 text-base text-gray-300">
            <WindIcon className="w-5 h-5 text-blue-400" />
            Wind:{" "}
            <span className="font-semibold text-blue-400">{windSpeedKmH} km/h</span>
          </span>
        </div>

        {/* Low/High */}
        <p className="text-xs text-gray-400 mb-2">{lowHigh}</p>

        {/* 7-Day Forecast */}
        <div className="mt-4 sm:mt-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">
            7-Day Weather Forecast
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4 mx-auto">
            {sevenDayForecasts.map((forecast, idx) => (
              <ForecastCard key={idx} {...forecast} />
            ))}
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="mt-4 sm:mt-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">
            Hourly Weather Forecast
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-4">
            {forecastData?.list?.slice(0, HOURLY_FORECAST_LIMIT).map((hour, idx) => {
              const hourTime = formatHourTime(hour.dt, timezoneOffsetSeconds);
              const hourDate = new Date(hour.dt * 1000);
              const hourOfDay = hourDate.getUTCHours();
              const isDay = hourOfDay >= 6 && hourOfDay < 18;

              return (
                <HourlyCard
                  key={idx}
                  hourTime={hourTime}
                  temp={hour.main.temp}
                  humidity={hour.main.humidity}
                  weatherMain={hour.weather[0].main}
                  isDay={isDay}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

