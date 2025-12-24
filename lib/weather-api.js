import axios from "axios";

/**
 * Fetches current weather and forecast data for a given city
 * @param {string} city - City name to fetch weather for
 * @returns {Promise<{current: Object, forecast: Object}>}
 * @throws {Error} If API key is missing or API request fails
 */
export async function fetchWeatherData(city) {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
        throw new Error("API key not configured. Please set OPENWEATHERMAP_API_KEY in .env.local");
    }

    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
                    city
                )}&appid=${apiKey}&units=metric`
            ),
            axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
                    city
                )}&appid=${apiKey}&units=metric`
            ),
        ]);

        return {
            current: currentResponse.data,
            forecast: forecastResponse.data,
        };
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error(`City "${city}" not found`);
        }
        if (error.response?.status === 401) {
            throw new Error("Invalid API key");
        }
        throw new Error("Failed to fetch weather data. Please try again later.");
    }
}
