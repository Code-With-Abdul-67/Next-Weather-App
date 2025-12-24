// Wind speed conversion factor
export const MS_TO_KMH = 3.6;

// Forecast display limits
export const HOURLY_FORECAST_LIMIT = 8;
export const SEVEN_DAY_FORECAST_LIMIT = 7;

// Default city
export const DEFAULT_CITY = "Karachi";

// Weather video paths mapping
export const WEATHER_VIDEOS = {
    Clear: "/weather-videos/clear-sky.webm",
    Clouds: "/weather-videos/clouds.webm",
    Rain: "/weather-videos/rain.webm",
    Thunderstorm: "/weather-videos/thunderstrom.webm",
    Mist: "/weather-videos/mist.webm",
    Fog: "/weather-videos/fog.webm",
    Haze: "/weather-videos/haze.webm",
    Drizzle: "/weather-videos/drizzle.webm",
    Smoke: "/weather-videos/smoke.webm",
};

// Get weather video by condition
export function getWeatherVideo(weatherMain) {
    return WEATHER_VIDEOS[weatherMain] || WEATHER_VIDEOS.Clear;
}
