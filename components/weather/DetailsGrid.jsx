import { SunriseIcon, SunsetIcon, EyeIcon, ActivityIcon, HumidityIcon, WindIcon, ThermometerIcon } from "./WeatherIcon";

export function DetailsGrid({ weatherData, pollutionData, minMaxTemp, units }) {
  const visibilityKm = (weatherData.visibility / 1000).toFixed(1);
  const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  // AQI Map
  const aqiMap = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor"
  };
  const aqi = pollutionData?.list?.[0]?.main?.aqi;
  const aqiText = aqi ? aqiMap[aqi] : "N/A";

  const details = [
    {
      title: "Sunrise",
      value: sunrise,
      icon: <SunriseIcon className="w-6 h-6 text-orange-300" />,
    },
    {
      title: "Sunset",
      value: sunset,
      icon: <SunsetIcon className="w-6 h-6 text-orange-400" />,
    },
    {
      title: "Visibility",
      value: `${visibilityKm} km`,
      icon: <EyeIcon className="w-6 h-6 text-blue-300" />,
    },
    {
      title: "Air Quality",
      value: aqiText,
      icon: <ActivityIcon className="w-6 h-6 text-green-300" />,
    },
    {
      title: "Humidity",
      value: `${weatherData.main.humidity}%`,
      icon: <HumidityIcon className="w-6 h-6 text-blue-300" />,
    },
    {
      title: "Wind",
      // If imperial, speed is mph. If metric, speed is m/s. 
      // But user wants "km/h" if possible, or correct unit.
      // Standard: Metric=m/s, Imperial=mph. 
      // We will follow units prop. 
      // If units=metric, we convert m/s to km/h (~3.6) for display preference, or keep m/s.
      // The previous Hero code converted to km/h. Let's stick to km/h for metric.
      value: units === "imperial" 
        ? `${Math.round(weatherData.wind.speed)} mph` 
        : `${Math.round(weatherData.wind.speed * 3.6)} km/h`,
      icon: <WindIcon className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "Low Temp",
      value: minMaxTemp ? `${minMaxTemp.min}°` : "N/A",
      icon: <ThermometerIcon className="w-6 h-6 text-cyan-300" />,
    },
    {
      title: "High Temp",
      value: minMaxTemp ? `${minMaxTemp.max}°` : "N/A",
      icon: <ThermometerIcon className="w-6 h-6 text-red-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-6">
      {details.map((detail, index) => (
        <div
          key={index}
          className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all"
        >
          <div className="p-2 bg-white/5 rounded-full">{detail.icon}</div>
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            {detail.title}
          </span>
          <span className="text-white font-bold text-lg">{detail.value}</span>
        </div>
      ))}
    </div>
  );
}
