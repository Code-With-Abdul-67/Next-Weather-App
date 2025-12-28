/**
 * Processes forecast data into daily summaries
 * @param {Object} forecastData - Raw forecast data from API
 * @param {number} timezoneOffsetSeconds - Timezone offset in seconds
 * @param {number} limit - Maximum number of days to return
 * @returns {Array} Array of daily forecast objects
 */
export function processDailyForecast(forecastData, timezoneOffsetSeconds, limit = 7) {
    if (!forecastData?.list) return [];

    const dailyData = {};

    forecastData.list.forEach((entry) => {
        const cityDate = getCityTime(entry.dt, timezoneOffsetSeconds);
        const day = cityDate.toLocaleDateString("en-PK", {
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
                dateKey: `${cityDate.getFullYear()}-${cityDate.getMonth() + 1}-${cityDate.getDate()}`
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
        const dateKey = data.dateKey;

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

        return { day, avgTemp, minTemp, maxTemp, description, rainChance, cloudChance, dateKey };
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
 * Interpolates hourly data to fill gaps between 3-hour blocks
 * @param {Array} hourlyData - Array of 3-hour forecast entries
 * @returns {Array} Array of 1-hour forecast entries
 */
export function interpolateHourlyData(hourlyData) {
    if (!hourlyData || hourlyData.length < 2) return hourlyData;

    const result = [];
    for (let i = 0; i < hourlyData.length - 1; i++) {
        const current = hourlyData[i];
        const next = hourlyData[i + 1];

        result.push(current);

        const timeDiffSeconds = next.dt - current.dt;
        const hoursDiff = timeDiffSeconds / 3600;

        // Only interpolate if there's a gap of more than 1 hour
        if (hoursDiff > 1) {
            for (let j = 1; j < hoursDiff; j++) {
                const ratio = j / hoursDiff;
                const interpolatedDt = current.dt + (j * 3600);
                const interpolatedTemp = current.main.temp + (next.main.temp - current.main.temp) * ratio;

                result.push({
                    ...current,
                    dt: Math.round(interpolatedDt),
                    main: {
                        ...current.main,
                        temp: interpolatedTemp
                    },
                    // Use the weather condition from the nearest real data point
                    weather: ratio < 0.5 ? current.weather : next.weather
                });
            }
        }
    }
    // Add the last original point
    result.push(hourlyData[hourlyData.length - 1]);

    return result;
}

/**
 * Get Date object adjusted for city timezone
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {number} timezoneOffsetSeconds - Offset from UTC in seconds
 * @returns {Date}
 */
export function getCityTime(timestamp, timezoneOffsetSeconds) {
    const date = new Date(timestamp * 1000);
    return new Date(
        date.getTime() +
        timezoneOffsetSeconds * 1000 +
        date.getTimezoneOffset() * 60 * 1000
    );
}

/**
 * Format city time with timezone offset
 * @param {number} timezoneOffsetSeconds - Timezone offset in seconds
 * @returns {Object} Formatted date and time strings
 */
export function formatCityTime(timezoneOffsetSeconds) {
    const cityTime = getCityTime(Date.now() / 1000, timezoneOffsetSeconds);

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
    const cityHourTime = getCityTime(timestamp, timezoneOffsetSeconds);

    return cityHourTime.toLocaleTimeString("en-PK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}
