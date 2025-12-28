import axios from "axios";

/**
 * Fetches current weather and forecast data for a given city
 * @param {string} city - City name to fetch weather for
 * @returns {Promise<{current: Object, forecast: Object}>}
 * @throws {Error} If API key is missing or API request fails
 */
export async function fetchWeatherData(city, units = 'metric') {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;

    if (!apiKey) {
        console.error("❌ API Key missing. Please check Vercel settings.");
        throw new Error("API key not configured. Check Vercel Environment Variables or .env.local.");
    }

    try {
        let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=${units}`;
        let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=${units}`;

        // Check if city is a coordinate object { lat, lon }
        if (typeof city === "object" && city.lat && city.lon) {
            weatherUrl += `&lat=${city.lat}&lon=${city.lon}`;
            forecastUrl += `&lat=${city.lat}&lon=${city.lon}`;
        } else {
            weatherUrl += `&q=${encodeURIComponent(city)}`;
            forecastUrl += `&q=${encodeURIComponent(city)}`;
        }

        const [currentResponse, forecastResponse] = await Promise.all([
            axios.get(weatherUrl),
            axios.get(forecastUrl),
        ]);

        // Polluting fetching (requires lat/lon from current response)
        const { coord } = currentResponse.data;
        let pollutionData = null;
        try {
            const pollutionResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`
            );
            pollutionData = pollutionResponse.data;
        } catch (e) {
            console.warn("Failed to fetch pollution data", e.message);
        }

        return {
            current: currentResponse.data,
            forecast: forecastResponse.data,
            pollution: pollutionData
        };
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error("Location not found");
        }
        if (error.response?.status === 401) {
            throw new Error("Invalid API key");
        }
        throw new Error("Failed to fetch weather data. Please try again later.");
    }
}

