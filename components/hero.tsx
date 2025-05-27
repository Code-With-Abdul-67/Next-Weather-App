import axios from "axios";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
  }[];
  visibility: number;
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  name: string;
}

interface HeroProps {
  city?: string;
}
const fetchWeatherData = async (city: string): Promise<WeatherData | null> => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  console.log("Fetching weather for city:", city);
  console.log("API Key loaded:", apiKey);
  if (!apiKey) {
    console.error(
      "API key not set in .env.local. Please add OPENWEATHERMAP_API_KEY to .env.local.",
    );
    return null;
  }

  try {
    console.log(
      "API Request URL:",
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {

    return null;
  }
};

export const Hero = async ({ city = "Karachi" }: HeroProps) => {
  const weatherData = await fetchWeatherData(city);

  // Default values if API call fails
  const temperature = weatherData ? Math.round(weatherData.main.temp) : 10;
  const description = weatherData
    ? weatherData.weather[0].description
    : "Clear Sky (API Error)";
  const feelsLike = weatherData ? Math.round(weatherData.main.feels_like) : 8;
  const humidity = weatherData ? weatherData.main.humidity : 62;
  const visibility = weatherData
    ? Math.round(weatherData.visibility / 1000)
    : 10; // Convert to km
  const pressure = weatherData ? weatherData.main.pressure : 1033;
  const windSpeed = weatherData ? weatherData.wind.speed : 2;
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
    ? `Low: ${Math.round(temperature - 4)}° High: ${Math.round(temperature + 2)}°`
    : "Low: 6° High: 12°";

  return (
    <main className="flex flex-col items-center justify-start bg-black min-h-screen text-white p-6">
      {/* Top Section: Main Weather Info */}
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center mb-6">
        <p className="text-sm text-gray-400 mb-2">
          Tuesday 05:06 PM PKT, May 27, 2025
        </p>
        <h1 className="text-8xl font-bold text-white">{temperature}°</h1>
        <p className="text-xl text-gray-400">{description}</p>
        <p className="text-sm text-gray-400">{lowHigh}</p>
      </div>

      {/* Middle Section: Cards Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Air Pollution (Static for now) */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Air Pollution</p>
          <div className="w-full h-2 bg-gradient-to-r from-blue-400 to-orange-500 rounded-full mt-2"></div>
          <p className="text-sm text-gray-400 mt-2">
            Air quality is excellent.
          </p>
        </div>

        {/* Sunset */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Sunset</p>
          <p className="text-lg font-semibold">{sunset}</p>
          <p className="text-sm text-gray-400">Sunrise: {sunrise}</p>
        </div>

        {/* Wind */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-400 font-bold">Wind</p>
          <div className="w-20 h-20 mx-auto relative">
            {" "}
            {/* Increased from w-16 h-16 to w-20 h-20 */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4B5563"
                strokeWidth="2"
              />
              <line
                x1="50"
                y1="5"
                x2="50"
                y2="20"
                stroke="#fff"
                strokeWidth="2"
                transform="rotate(90 50 50)"
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dy="0.3em"
                fontSize="10"
                fill="#fff"
                fontWeight="bold"
              >
                N
              </text>
              <text
                x="50"
                y="95"
                textAnchor="middle"
                dy="0.3em"
                fontSize="10"
                fill="#fff"
                fontWeight="bold"
              >
                S
              </text>
              <text
                x="5"
                y="50"
                textAnchor="middle"
                dx="-0.3em"
                fontSize="10"
                fill="#fff"
                fontWeight="bold"
              >
                W
              </text>
              <text
                x="95"
                y="50"
                textAnchor="middle"
                dx="0.3em"
                fontSize="10"
                fill="#fff"
                fontWeight="bold"
              >
                E
              </text>
              <text
                x="50"
                y="40"
                textAnchor="middle"
                fontSize="12"
                fill="#fff"
                fontWeight="bold"
              >
                {windSpeed} m/s
              </text>
            </svg>
          </div>
        </div>
        {/* UV Index (Static for now) */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">UV Index</p>
          <p className="text-lg font-semibold">4 (Moderate)</p>
          <div className="w-1/2 h-2 bg-gradient-to-r from-blue-400 to-red-400 rounded-full mt-2"></div>
          <p className="text-sm text-gray-400 mt-2">
            Stay in shade near mid-day.
          </p>
        </div>

        {/* Population (Static for now) */}
        <div className="bg/white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Population</p>
          <p className="text-lg font-semibold">1.0M</p>
          <p className="text-sm text-gray-400">
            Latest UN population data for {cityName}.
          </p>
        </div>

        {/* Feels Like */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Feels Like</p>
          <p className="text-lg font-semibold">{feelsLike}°</p>
          <p className="text-sm text-gray-400">
            Feels close to the actual temperature.
          </p>
        </div>

        {/* Humidity */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Humidity</p>
          <p className="text-lg font-semibold">{humidity}%</p>
          <p className="text-sm text-gray-400">
            Moderate. Sticky, may increase allergens.
          </p>
        </div>

        {/* Visibility */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Visibility</p>
          <p className="text-lg font-semibold">{visibility} km</p>
          <p className="text-sm text-gray-400">Good. Easy to navigate.</p>
        </div>

        {/* Pressure */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Pressure</p>
          <p className="text-lg font-semibold">{pressure} hPa</p>
          <p className="text-sm text-gray-400">
            High pressure. Expect weather changes.
          </p>
        </div>
      </div>

      {/* Bottom Section: Extended Map */}
      {/* <div className="w-full max-w-4xl mt-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400 mb-2">Map of {cityName}</p>
          <div className="w-full h-64 bg-gray-700 rounded-xl flex items-center justify-center">
            <p className="text-sm text-gray-400">[Map Placeholder]</p>
          </div>
        </div>
      </div> */}
    </main>
  );
};
