import axios from "axios";
import { Cloud } from "lucide-react";
import { Dancing_Script } from "next/font/google";

export const Hero = async ({ city = "Karachi" }) => {
  const fetchWeatherData = async (city) => {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    console.log("Fetching weather for city:", city);
    console.log("API Key loaded:", apiKey);
    if (!apiKey) {
      console.error("API key not set in .env.local.");
      return { current: null, forecast: null };
    }

    try {
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city
        )}&appid=${apiKey}&units=metric`
      );

      return {
        current: currentResponse.data,
        forecast: forecastResponse.data,
      };
    } catch (error) {
      console.error("Error fetching weather:", error);
      return { current: null, forecast: null };
    }
  };

  const { current: weatherData, forecast: forecastData } =
    await fetchWeatherData(city);

  const temperature = weatherData ? Math.round(weatherData.main.temp) : 10;
  const description = weatherData
    ? weatherData.weather[0].description
    : "Invalid city name";
  const feelsLike = weatherData ? Math.round(weatherData.main.feels_like) : 8;
  const humidity = weatherData ? weatherData.main.humidity : 62;
  const visibility = weatherData
    ? Math.round(weatherData.visibility / 1000)
    : 10;
  const pressure = weatherData ? weatherData.main.pressure : 1033;
  const windSpeed = weatherData ? weatherData.wind.speed : 2; // m/s
  const windDirection = weatherData ? weatherData.wind.deg : 0; // degrees
  const sunset = weatherData
    ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "18:51";
  const sunrise = weatherData
    ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "06:08";
  const cityName = weatherData ? weatherData.name : "Madrid";
  const lowHigh = weatherData
    ? `Low: ${Math.round(temperature - 4)}° High: ${Math.round(
        temperature + 2
      )}°`
    : "Low: 6° High: 12°";

  const timezoneOffsetSeconds = weatherData ? weatherData.timezone : 0;
  const currentTime = new Date();
  const cityTime = new Date(
    currentTime.getTime() +
      timezoneOffsetSeconds * 1000 +
      currentTime.getTimezoneOffset() * 60 * 1000
  );
  const formattedDateTime = cityTime.toLocaleString("en-PK", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedDate = cityTime.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let windGust = windSpeed;
  if (forecastData) {
    const next24Hours = forecastData.list.filter((entry) => {
      const forecastTime = new Date(entry.dt * 1000);
      return (
        forecastTime > cityTime &&
        forecastTime < cityTime.setHours(cityTime.getHours() + 24)
      );
    });
    windGust = Math.max(
      ...next24Hours.map((entry) => entry.wind.speed),
      windSpeed
    );
  }

  // Convert m/s to km/h
  const windSpeedKmH = Math.round(windSpeed * 3.6);
  const windGustKmH = Math.round(windGust * 3.6);

  // Calculate fill percentages for gauges
  const visibilityFill = (visibility / 10) * 100; // Visibility (0 km to 10 km) mapped to 0% to 100%
  const pressureFill = ((pressure - 900) / (1100 - 900)) * 100; // Pressure (900 hPa to 1100 hPa) mapped to 0% to 100%

  // Process 5-Day Forecast Data
  const dailyForecasts = [];
  if (forecastData) {
    const dailyData = {};

    forecastData.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const day = date.toLocaleDateString("en-PK", {
        weekday: "short",
        day: "numeric",
      });

      if (!dailyData[day]) {
        dailyData[day] = {
          temps: [],
          descriptions: [],
          rain: 0,
          date: date,
          cloud: entry.clouds.all,
        };
      }

      dailyData[day].temps.push(entry.main.temp);
      dailyData[day].descriptions.push(entry.weather[0].description);
      dailyData[day].rain += entry.rain?.["3h"] || 0;
    });

    for (const [day, data] of Object.entries(dailyData)) {
      const avgTemp = Math.round(
        data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length
      );
      const description = data.descriptions
        .sort(
          (a, b) =>
            data.descriptions.filter((d) => d === b).length -
            data.descriptions.filter((d) => d === a).length
        )
        .pop();
      const rainChance =
        data.rain > 0 ? Math.min(100, Math.round(data.rain * 10)) : 0;

      const cloudChance =
        data.cloud > 0 ? Math.min(100, Math.round(data.cloud * 10)) : 0;

      dailyForecasts.push({
        day,
        avgTemp,
        description,
        rainChance,
        cloudChance,
      });
    }

    dailyForecasts.splice(5);
  }

  return (
    <main className="flex flex-col items-center justify-start bg-black min-h-screen text-white p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center mb-4 sm:mb-6 bg-gradient-to-br from-gray-900 via-gray-800">
        <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
          {formattedDateTime}, {formattedDate} in {cityName}
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white">
          {temperature}°
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400">
          {description}
        </p>
        <p className="text-xs sm:text-sm md:text-base text-gray-400">
          {lowHigh}
        </p>
        <div className="mt-4 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">
            5 Days Weather Forecast
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
            {dailyForecasts.map((forecast, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-gray-700 rounded-lg sm:rounded-2xl p-2 sm:p-3 text-center hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <p className="text-xs sm:text-sm font-semibold text-gray-300">
                  {forecast.day}
                </p>
                <p className="text-sm sm:text-base font-bold text-white">
                  {forecast.avgTemp}°
                </p>

                {/* Cloud Icon */}
                <div className="flex items-center justify-center mt-1">
                  <p>Clouds:</p>
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    title="Chance of Clouds"
                  >
                    <path d="M13 7a4 4 0 00-7.906-1.027A3.5 3.5 0 005.5 14H13a3 3 0 000-6z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {forecast.cloudChance}%
                  </span>
                </div>

                {/* Rain Icon */}
                <div className="flex items-center justify-center mt-1">
                  <p>Rain:</p>
                  <svg
                    className="w-7 h-7 text-blue-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 26 26"
                    xmlns="http://www.w3.org/2000/svg"
                    title="Chance of Rain"
                  >
                    <path d="M16 13a4 4 0 10-8 0H5a5 5 0 019.9-1.25A4 4 0 0116 13zm-4 7a1 1 0 01-1-1v-.01a1 1 0 012 0V19a1 1 0 01-1 1zm-4-2a1 1 0 01-1-1v-.01a1 1 0 012 0V17a1 1 0 01-1 1zm8 2a1 1 0 01-1-1v-.01a1 1 0 012 0V19a1 1 0 01-1 1z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {forecast.rainChance}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Pressure */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black backdrop-blur-md border border-gray-700 rounded-lg sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 border-3 border-gray-500 rounded-lg sm:rounded-xl p-2 sm:p-3">
          <p className="text-xs sm:text-sm uppercase text-gray-300 font-semibold tracking-widest mb-2 sm:mb-3 ">
            Pressure
          </p>
          <div className="w-32 h-32 sm:w-40 sm:h-25 mx-auto relative mb-2 sm:mb-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="url(#pressureGradient)"
                strokeWidth="8"
                strokeDasharray={`${pressureFill * 2.2}, 220`} // 220 is circumference of circle with r=35
              />
              <defs>
                <linearGradient
                  id="pressureGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: "#4B5EAA" }} />
                  <stop offset="100%" style={{ stopColor: "#A9BFE0" }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-base font-bold text-white">
              {pressure} hPa
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              {pressure >= 1013 ? "High pressure" : "Low pressure"}. Expect
              weather changes.
            </p>
          </div>
        </div>

        {/* Wind */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black backdrop-blur-md border border-gray-700 rounded-lg sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 border-3 border-gray-500 rounded-lg sm:rounded-xl p-2 sm:p-3">
          <p className="text-xs sm:text-sm uppercase text-gray-300 font-semibold tracking-widest mb-2 sm:mb-3">
            Wind
          </p>
          <div className="w-32 h-32 sm:w-40 sm:h-25 mx-auto relative mb-2 sm:mb-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="#A9BFE0"
                strokeWidth="8"
              />
              <g transform={`rotate(${windDirection} 50 50)`}>
                <line
                  className="text-blue-400 mr-1"
                  x1="50"
                  y1="23"
                  x2="50"
                  y2="45"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  markerEnd="url(#arrowhead)"
                />
              </g>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="5"
                  markerHeight="1.5"
                  refX="7.9"
                  refY="1.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#fff" />
                </marker>
              </defs>
              <text
                x="50"
                y="18"
                textAnchor="middle"
                fill="#000"
                fontSize="9"
                fontFamily="Cursive"
                fontWeight="700"
              >
                N
              </text>
              <text
                x="85"
                y="53"
                textAnchor="middle"
                fill="#000"
                fontSize="9"
                fontFamily="Cursivw"
                fontWeight="700"
              >
                E
              </text>
              <text
                x="50"
                y="88"
                textAnchor="middle"
                fill="#000"
                fontSize="9"
                fontFamily="Cursive"
                fontWeight="700"
              >
                S
              </text>
              <text
                x="15"
                y="53"
                textAnchor="middle"
                fill="#000"
                fontSize="9"
                fontFamily="Cursive"
                fontWeight="700"
              >
                W
              </text>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-base font-bold text-white">
              {windSpeedKmH} km/h
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Gusts: {windGustKmH} km/h
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Direction: {windDirection}° {getCardinalDirection(windDirection)}
            </p>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black backdrop-blur-md border border-gray-700 rounded-lg sm:rounded-2xl p-4 sm:p-6 text-center shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 border-3 border-gray-500 rounded-lg sm:rounded-xl p-2 sm:p-3">
          <p className="text-xs sm:text-sm uppercase text-gray-300 font-semibold tracking-widest mb-2 sm:mb-3">
            Visibility
          </p>
          <div className="w-32 h-32 sm:w-40 sm:h-25 mx-auto relative mb-2 sm:mb-4">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="url(#visibilityGradient)"
                strokeWidth="8"
                strokeDasharray={`${visibilityFill * 2.2}, 220`} // 220 is circumference of circle with r=35
              />
              <defs>
                <linearGradient
                  id="visibilityGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: "#4B5EAA" }} />
                  <stop offset="100%" style={{ stopColor: "#A9BFE0" }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm sm:text-base font-bold text-white">
              {visibility} km
            </p>
            <p className="text-xs sm:text-sm text-gray-400">In {cityName}</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-gray-900 via-gray-800 hover:bg-white/20 hover:scale-105 transition-all duration-300 border-3 border-gray-500 rounded-lg sm:rounded-xl p-2 sm:p-3">
          <p className="text-xs sm:text-sm font-semibold">Humidity</p>
          <p className="text-base sm:text-lg font-semibold">{humidity}%</p>
          <p className="text-xs sm:text-sm text-gray-400">In {cityName}</p>
        </div>

        {/* Feels Like */}
        <div className="bg-white/5 backdrop-blur-md border/20 rounded-lg sm:rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-gray-900 via-gray-800 hover:bg-white/20 hover:scale-105 transition-all duration-300 border-3 border-gray-500 rounded-lg sm:rounded-xl p-2 sm:p-3">
          <p className="text-xs sm:text-sm font-semibold">Feels Like</p>
          <p className="text-base sm:text-lg font-semibold">{feelsLike}°</p>
          <p className="text-xs sm:text-sm text-gray-400">
            Feels close to the actual temperature in {cityName}.
          </p>
        </div>

        {/* Sunset */}
        <div className="bg-white/5 backdrop-blur-md/20 rounded-lg sm:rounded-2xl p-3 sm:p-4 bg-gradient-to-br from-gray-900 via-gray-800 hover:bg-white/20 hover:scale-105 transition-all duration-300 border-3 border-gray-500 rounded-lg sm:rounded-xl p-2 sm:p-3">
          <p className="text-xs sm:text-sm text-gray-400 ">
            Sunset in {cityName}
          </p>
          <p className="text-base sm:text-lg font-semibold">{sunset}</p>
          <p className="text-xs sm:text-sm text-gray-400 ">
            Sunrise in {cityName}
          </p>
          <p className="text-base sm:text-lg font-semibold">{sunrise}</p>
        </div>
      </div>
    </main>
  );
};

// Helper function to convert degrees to cardinal direction
function getCardinalDirection(degrees) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
