import axios from "axios";

// Function to map weather condition to GIF
const getWeatherGif = (weatherMain) => {
  switch (weatherMain) {
    case "Clear":
      return "/weather-videos/clear-sky.webm";
    case "Clouds":
      return "/weather-videos/clouds.webm";
    case "Rain":
      return "/weather-videos/rain.webm";
    case "Thunderstorm":
      return "/weather-videos/thunderstrom.webm";
    case "Mist":
      return "/weather-videos/mist.webm";
    case "Fog":
      return "/weather-videos/fog.webm";
    case "Haze":
      return "/weather-videos/haze.webm";
    case "Drizzle":
      return "/weather-videos/drizzle.webm";
    case "Smoke":
      return "/weather-videos/smoke.webm";
  }
};

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

  const windSpeed = weatherData ? weatherData.wind.speed : 2; // m/s
  const cityName = weatherData ? weatherData.name : "Karachi";
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



  // Convert m/s to km/h
  const windSpeedKmH = Math.round(windSpeed * 3.6);


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

  // Process up to 7-Day Forecast Data
  const sevenDayForecasts = [];
  if (forecastData) {
    const sevenDayData = {};
    forecastData.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const day = date.toLocaleDateString("en-PK", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      if (!sevenDayData[day]) {
        sevenDayData[day] = {
          temps: [],
          descriptions: [],
          rain: 0,
          cloud: entry.clouds.all,
        };
      }
      sevenDayData[day].temps.push(entry.main.temp);
      sevenDayData[day].descriptions.push(entry.weather[0].description);
      sevenDayData[day].rain += entry.rain?.["3h"] || 0;
    });
    for (const [day, data] of Object.entries(sevenDayData)) {
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
      sevenDayForecasts.push({
        day,
        avgTemp,
        description,
        rainChance,
        cloudChance,
      });
    }
    sevenDayForecasts.splice(7);
  }

  // Get weather main for GIF
  const weatherMain = weatherData ? weatherData.weather[0].main : "Clear";
  const weatherGif = getWeatherGif(weatherMain);

  return (
    <main className="relative flex flex-col items-center justify-start bg-grey min-h-[120vh] text-white p-4 sm:p-6">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full min-h-screen min-w-full object-cover z-0"
        src={weatherGif}
        type="video/webm"
      />
      {/* Overlay content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg flex flex-col items-center">
        {/* City Name */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          {/* Weather Icon */}
          <span>
            {weatherMain === "Clear" && (
              <svg
                className="w-8 h-8 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="6" />
              </svg>
            )}
            {weatherMain === "Clouds" && (
              <svg
                className="w-8 h-8 text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <ellipse cx="12" cy="14" rx="8" ry="5" />
              </svg>
            )}
            {weatherMain === "Rain" && (
              <svg
                className="w-8 h-8 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <ellipse cx="12" cy="14" rx="8" ry="5" />
                <line
                  x1="8"
                  y1="19"
                  x2="8"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="16"
                  y1="19"
                  x2="16"
                  y2="21"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
            {/* Add more icons as needed */}
          </span>
          {cityName}
        </h2>
        {/* Date & Description */}
        <p className="text-sm text-gray-300 mb-2">
          {formattedDateTime}, {formattedDate}
        </p>
        <p className="text-base text-gray-400 mb-2 capitalize">{description}</p>
        {/* Temperature & Wind */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="flex items-center gap-2 text-5xl font-bold text-white">
            {temperature}°{/* Wind Icon */}
            <svg
              className="w-8 h-8 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 12h13a4 4 0 1 1 0 8H7" />
              <path d="M3 6h9a3 3 0 1 1 0 6H5" />
            </svg>
          </span>
        </div>
        {/* Humidity & Wind Details */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <span className="flex items-center gap-1 text-base text-gray-300">
            {/* Humidity Icon */}
            <svg
              className="w-5 h-5 text-blue-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C12 2 7 8.5 7 12a5 5 0 0010 0c0-3.5-5-10-5-10zm0 18a4 4 0 110-8 4 4 0 010 8z" />
            </svg>
            Humidity:{" "}
            <span className="font-semibold text-blue-300">
              {weatherData?.main?.humidity ?? "--"}%
            </span>
          </span>
          <span className="flex items-center gap-1 text-base text-gray-300">
            {/* Wind Icon */}
            <svg
              className="w-5 h-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 12h13a4 4 0 1 1 0 8H7" />
              <path d="M3 6h9a3 3 0 1 1 0 6H5" />
            </svg>
            Wind:{" "}
            <span className="font-semibold text-blue-400">
              {windSpeedKmH} km/h
            </span>
          </span>
        </div>
        {/* Low/High */}
        <p className="text-xs text-gray-400 mb-2">{lowHigh}</p>

        <div className="mt-4 sm:mt-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">
            7 Days Weather Forecast
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4 mx-auto">
            {sevenDayForecasts.map((forecast, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-gray-700 rounded-lg sm:rounded-2xl p-2 sm:p-3 text-center flex flex-col items-center"
              >
                <p className="text-xs sm:text-sm font-semibold text-gray-300 mb-1">
                  {forecast.day}
                </p>
                <p className="text-base font-bold text-white mb-1">
                  {forecast.avgTemp}°
                </p>
                <p className="text-xs text-gray-400 capitalize mb-1">
                  {forecast.description}
                </p>
                <div className="flex gap-2">
                  <span className="flex items-center text-blue-400 text-xs">
                    {/* Realistic Rain icon */}
                    <svg className="w-5 h-5 mr-1" viewBox="0 0 64 64" fill="none">
                      <ellipse cx="32" cy="32" rx="20" ry="12" fill="#b3c6e7" />
                      <line
                        x1="24"
                        y1="48"
                        x2="24"
                        y2="56"
                        stroke="#4fc3f7"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <line
                        x1="32"
                        y1="48"
                        x2="32"
                        y2="56"
                        stroke="#4fc3f7"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <line
                        x1="40"
                        y1="48"
                        x2="40"
                        y2="56"
                        stroke="#4fc3f7"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    {forecast.rainChance}%
                  </span>
                  <span className="flex items-center text-gray-300 text-xs">
                    {/* Realistic Cloud icon */}
                    <svg className="w-5 h-5 mr-1" viewBox="0 0 64 64" fill="none">
                      <ellipse cx="32" cy="36" rx="20" ry="12" fill="#e0e7ef" />
                      <ellipse cx="44" cy="32" rx="12" ry="8" fill="#cfd8dc" />
                    </svg>
                    {forecast.cloudChance}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Hourly Forecast */}
        <div className="mt-4 sm:mt-6 w-full">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-4">
            Hourly Weather Forecast
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-4">
            {forecastData?.list?.slice(0, 8).map((hour, idx) => {
              const hourDate = new Date(hour.dt * 1000);
              const hourTime = hourDate.toLocaleTimeString("en-PK", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });
              const main = hour.weather[0].main.toLowerCase();
              const hourOfDay = hourDate.getHours();
              const isDay = hourOfDay >= 6 && hourOfDay < 18;

              return (
                <div
                  key={idx}
                  className="bg-black/30 backdrop-blur-md border border-gray-700 rounded-lg sm:rounded-2xl p-2 sm:p-3 text-center hover:bg-white/20 hover:scale-105 transition-all duration-300 flex flex-col items-center"
                >
                  <p className="text-xs sm:text-sm font-semibold text-gray-300 mb-1">
                    {hourTime}
                  </p>
                  <div className="flex items-center justify-center mb-1">
                    {/* Realistic Rain/Cloud/Sun/Moon SVGs */}
                    {main.includes("rain") ? (
                      // Realistic Rain SVG
                      <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none">
                        <ellipse cx="32" cy="32" rx="20" ry="12" fill="#b3c6e7" />
                        <line
                          x1="24"
                          y1="48"
                          x2="24"
                          y2="56"
                          stroke="#4fc3f7"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <line
                          x1="32"
                          y1="48"
                          x2="32"
                          y2="56"
                          stroke="#4fc3f7"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <line
                          x1="40"
                          y1="48"
                          x2="40"
                          y2="56"
                          stroke="#4fc3f7"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : main.includes("cloud") ? (
                      // Realistic Cloud SVG
                      <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none">
                        <ellipse cx="32" cy="36" rx="20" ry="12" fill="#e0e7ef" />
                        <ellipse cx="44" cy="32" rx="12" ry="8" fill="#cfd8dc" />
                      </svg>
                    ) : isDay ? (
                      // Sun SVG
                      <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="12" fill="#ffe066" />
                        <g stroke="#ffe066" strokeWidth="3">
                          <line x1="32" y1="8" x2="32" y2="0" />
                          <line x1="32" y1="56" x2="32" y2="64" />
                          <line x1="8" y1="32" x2="0" y2="32" />
                          <line x1="56" y1="32" x2="64" y2="32" />
                          <line x1="12" y1="12" x2="4" y2="4" />
                          <line x1="52" y1="12" x2="60" y2="4" />
                          <line x1="12" y1="52" x2="4" y2="60" />
                          <line x1="52" y1="52" x2="60" y2="60" />
                        </g>
                      </svg>
                    ) : (
                      // Moon SVG
                      <svg className="w-8 h-8" viewBox="0 0 64 64" fill="none">
                        <circle cx="40" cy="32" r="12" fill="#b3c6e7" />
                        <path
                          d="M40 20a12 12 0 1 0 0 24c-6.627 0-12-5.373-12-12 0-6.627 5.373-12 12-12z"
                          fill="#fff"
                          opacity="0.7"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-lg font-bold text-white mb-1">
                    {Math.round(hour.main.temp)}°
                  </p>
                  {/* Humidity & Rain chance */}
                  <div className="flex items-center justify-center gap-1 text-xs text-blue-300">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C12 2 7 8.5 7 12a5 5 0 0010 0c0-3.5-5-10-5-10zm0 18a4 4 0 110-8 4 4 0 010 8z" />
                    </svg>
                    {hour.main.humidity}%
                  </div>
                  {main.includes("rain") && (
                    <div className="flex items-center justify-center gap-1 text-xs text-blue-400 mt-1">
                      {/* Realistic Rain SVG */}
                      <svg className="w-4 h-4" viewBox="0 0 64 64" fill="none">
                        <ellipse cx="32" cy="32" rx="20" ry="12" fill="#b3c6e7" />
                        <line
                          x1="24"
                          y1="48"
                          x2="24"
                          y2="56"
                          stroke="#4fc3f7"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <line
                          x1="32"
                          y1="48"
                          x2="32"
                          y2="56"
                          stroke="#4fc3f7"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <line
                          x1="40"
                          y1="48"
                          x2="40"
                          y2="56"
                          stroke="#4fc3f7"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Rain
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};
