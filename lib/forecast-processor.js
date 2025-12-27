/**
 * Processes forecast data into daily summaries
 * @param {Object} forecastData - Raw forecast data from API
 * @param {number} limit - Maximum number of days to return
 * @returns {Array} Array of daily forecast objects
 */
export function processDailyForecast(forecastData, limit = 7) {
    if (!forecastData?.list) return [];

    const dailyData = {};

    forecastData.list.forEach((entry) => {
        const date = new Date(entry.dt * 1000);
        const day = date.toLocaleDateString("en-PK", {
            weekday: "short",
            day: "numeric",
            month: "short",
        });

        if (!dailyData[day]) {
            dailyData[day] = {
                min: entry.main.temp,
                max: entry.main.temp,
                descriptions: [],
                rain: 0,
                cloud: entry.clouds.all,
            };
        }

        dailyData[day].min = Math.min(dailyData[day].min, entry.main.temp);
        dailyData[day].max = Math.max(dailyData[day].max, entry.main.temp);
        dailyData[day].descriptions.push(entry.weather[0].description);
        dailyData[day].rain += entry.rain?.[`3h`] || 0;
    });

    const forecasts = Object.entries(dailyData).map(([day, data]) => {
        const minTemp = Math.round(data.min);
        const maxTemp = Math.round(data.max);
        const avgTemp = Math.round((data.min + data.max) / 2);

        // Get most common weather description
        const description = data.descriptions
            .sort(
                (a, b) =>
                    data.descriptions.filter((d) => d === b).length -
                    data.descriptions.filter((d) => d === a).length
            )
            .pop();

        // Rain chance calculation (rain is in mm, scale to percentage)
        const rainChance = data.rain > 0 ? Math.min(100, Math.round(data.rain * 10)) : 0;

        // Cloud chance is already 0-100%, no multiplication needed (BUG FIX)
        const cloudChance = data.cloud;

        return { day, avgTemp, minTemp, maxTemp, description, rainChance, cloudChance };
    });

    return forecasts.slice(0, limit);
}

/**
 * Calculate min and max temperatures from forecast data
 * @param {Object} forecastData - Raw forecast data from API
 * @param {number} hoursToCheck - Number of forecast hours to check
 * @returns {{min: number, max: number} | null}
 */
export function calculateMinMaxTemp(forecastData, hoursToCheck = 8) {
    if (!forecastData?.list || forecastData.list.length === 0) {
        return null;
    }

    const temps = forecastData.list.slice(0, hoursToCheck).map((h) => h.main.temp);

    return {
        min: Math.round(Math.min(...temps)),
        max: Math.round(Math.max(...temps)),
    };
}

/**
 * Format city time with timezone offset
 * @param {number} timezoneOffsetSeconds - Timezone offset in seconds
 * @returns {Object} Formatted date and time strings
 */
export function formatCityTime(timezoneOffsetSeconds) {
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

    return { formattedDateTime, formattedDate };
}

/**
 * Format hour time for hourly forecast with timezone offset
 * @param {number} timestamp - Unix timestamp
 * @param {number} timezoneOffsetSeconds - Timezone offset in seconds
 * @returns {string} Formatted time string
 */
export function formatHourTime(timestamp, timezoneOffsetSeconds) {
    const hourDate = new Date(timestamp * 1000);

    // Apply timezone offset to get correct city time (BUG FIX)
    const cityHourTime = new Date(
        hourDate.getTime() +
        timezoneOffsetSeconds * 1000 +
        hourDate.getTimezoneOffset() * 60 * 1000
    );

    return cityHourTime.toLocaleTimeString("en-PK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}
