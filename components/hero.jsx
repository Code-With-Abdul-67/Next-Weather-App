import { fetchWeatherData } from "@/lib/weather-api";
import {
  processDailyForecast,
  calculateMinMaxTemp,
  formatCityTime,
} from "@/lib/forecast-processor";
import {
  getWeatherVideo,
  DEFAULT_CITY,
  SEVEN_DAY_FORECAST_LIMIT,
} from "@/lib/constants";
import { ErrorState } from "@/components/weather/ErrorState";
import { WeatherDashboard } from "@/components/weather/WeatherDashboard";

export const Hero = async ({ city = DEFAULT_CITY, units = "metric" }) => {
  let weatherData, forecastData, pollutionData;
  try {
    const data = await fetchWeatherData(city, units);
    weatherData = data.current;
    forecastData = data.forecast;
    pollutionData = data.pollution;
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
  const sevenDayForecasts = processDailyForecast(forecastData, timezoneOffsetSeconds, SEVEN_DAY_FORECAST_LIMIT);
  const weatherVideo = getWeatherVideo(weatherMain);

  return (
    <main className="relative flex flex-col items-center justify-start bg-gray-900 min-h-screen text-white p-4 pt-4 md:pt-8">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-60"
        src={weatherVideo}
        type="video/webm"
      />

      <WeatherDashboard
        cityName={cityName}
        description={description}
        forecastData={forecastData}
        formattedDateTime={formattedDateTime}
        minMaxTemp={minMaxTemp}
        pollutionData={pollutionData}
        sevenDayForecasts={sevenDayForecasts}
        temperature={temperature}
        timezoneOffsetSeconds={timezoneOffsetSeconds}
        units={units}
        weatherData={weatherData}
      />
    </main>
  );
};
