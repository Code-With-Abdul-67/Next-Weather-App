
import axios from "axios";

export const Hero = async ({ city = "Karachi" }) => {
  const fetchWeatherData = async (city) => {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    console.log("Fetching weather for city:", city);
    console.log("API Key loaded:", apiKey);
    if (!apiKey) {
      console.error("API key not set in .env.local.");
      return null;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching weather:", error);
      return null;
    }
  };

  const weatherData = await fetchWeatherData(city);

  const temperature = weatherData ? Math.round(weatherData.main.temp) : 10;
  const description = weatherData
    ? weatherData.weather[0].description
    : "Clear Sky (API Error)";
  const feelsLike = weatherData ? Math.round(weatherData.main.feels_like) : 8;
  const humidity = weatherData ? weatherData.main.humidity : 62;
  const visibility = weatherData
    ? Math.round(weatherData.visibility / 1000)
    : 10;
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
    ? `Low: ${Math.round(temperature - 4)}° High: ${Math.round(
        temperature + 2
      )}°`
    : "Low: 6° High: 12°";

  return (
    <main className="flex flex-col items-center justify-start bg-black min-h-screen text-white p-6">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center mb-6">
        <p className="text-sm text-gray-400 mb-2">
          Tuesday 05:06 PM PKT, May 27, 2025
        </p>
        <h1 className="text-8xl font-bold text-white">{temperature}°</h1>
        <p className="text-xl text-gray-400">{description}</p>
        <p className="text-sm text-gray-400">{lowHigh}</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Air Pollution</p>
          <div className="w-full h-2 bg-gradient-to-r from-blue-400 to-orange-500 rounded-full mt-2"></div>
          <p className="text-sm text-gray-400 mt-2">Air quality is excellent.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Sunset</p>
          <p className="text-lg font-semibold">{sunset}</p>
          <p className="text-sm text-gray-400">Sunrise: {sunrise}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-center">
          <p className="text-xs uppercase text-gray-300 font-semibold tracking-widest mb-3">
            Wind
          </p>
          <div className="w-24 h-24 mx-auto relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="4"
              />
              <line
                x1="50"
                y1="10"
                x2="50"
                y2="28"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                transform="rotate(90 50 50)"
              />
              <text x="50" y="18" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
                N
              </text>
              <text x="50" y="85" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
                S
              </text>
              <text x="18" y="52" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
                W
              </text>
              <text x="82" y="52" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
                E
              </text>
              <text x="50" y="48" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
                {windSpeed} m/s
              </text>
            </svg>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">UV Index</p>
          <p className="text-lg font-semibold">4 (Moderate)</p>
          <div className="w-1/2 h-2 bg-gradient-to-r from-blue-400 to-red-400 rounded-full mt-2"></div>
          <p className="text-sm text-gray-400 mt-2">Stay in shade near mid-day.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Population</p>
          <p className="text-lg font-semibold">1.0M</p>
          <p className="text-sm text-gray-400">
            Latest UN population data for {cityName}.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Feels Like</p>
          <p className="text-lg font-semibold">{feelsLike}°</p>
          <p className="text-sm text-gray-400">Feels close to the actual temperature.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Humidity</p>
          <p className="text-lg font-semibold">{humidity}%</p>
          <p className="text-sm text-gray-400">Moderate. Sticky, may increase allergens.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Visibility</p>
          <p className="text-lg font-semibold">{visibility} km</p>
          <p className="text-sm text-gray-400">Good. Easy to navigate.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <p className="text-sm text-gray-400">Pressure</p>
          <p className="text-lg font-semibold">{pressure} hPa</p>
          <p className="text-sm text-gray-400">High pressure. Expect weather changes.</p>
        </div>
      </div>
    </main>
  );
};
