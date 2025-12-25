# 🌦️ Next Weather App

A stunning, feature-rich weather application built with **Next.js 14**, providing real-time weather updates, dynamic video backgrounds, and a premium "glassmorphism" UI. 

Now optimized as a **Progressive Web App (PWA)** for a native app-like experience on iOS and Android! 📱✨

---

## 🚀 Key Features

*   **⚡ Next.js 14 App Router**: Leveraging Server Components and Server Actions for lightning-fast performance.
*   **🎨 Premium UI/UX**: Beautiful glassmorphism design with auto-playing video backgrounds that change based on the weather conditions.
*   **📱 PWA Support**: Fully installable on mobile devices! Add it to your home screen for a fullscreen, native app experience without the browser chrome.
*   **🔍 Smart Search**: Real-time city search with autocomplete suggestions.
*   **🍪 Clean URL Architecture**: Uses **Cookies** & **Server Actions** to manage state, keeping your URLs clean (no ugly query parameters like `?city=london`).
*   **⏳ Dynamic Loading Experience**: Custom loading animation that tells you exactly what it's doing (e.g., *"Getting weather status for London..."*).
*   **📊 Comprehensive Data**: 
    *   **Advanced Details**: AQI (Air Quality Index), Visibility, Sunrise & Sunset times.
    *   Current Weather (Temp, Humidity, Wind).
    *   7-Day Forecast cards.
    *   24-Hour detailed hourly forecast.
*   **📍 Geolocation**: "Use My Location" button to instantly check the weather around you.
*   **⭐ Favorites**: Save your favorite cities for quick access.
*   **🌡️ Unit Switcher**: Toggle easily between Celsius (°C) and Fahrenheit (°F).

---

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Data**: [OpenWeatherMap API](https://openweathermap.org/)
*   **Deployment**: [Vercel](https://vercel.com/)

---

## 🔄 Recent Updates & Changelog

We've been hard at work polishing the experience! Here is a summary of the latest changes:

### ✨ **New Features**
*   **Mobile Favorites Interface**: Added a dedicated Heart icon and a "Favorite Cities" quick-access list specifically optimized for mobile devices.
*   **PWA Integration**: Added `manifest.json` and Service Workers. You can now install this web app on your phone!
    *   **iOS**: Share -> Add to Home Screen.
    *   **Android**: Install prompt or Menu -> Install App.
*   **Smart Loading Overlay**: 
    *   The loading screen now persists on page refreshes.
    *   It intelligently displays the city name being fetched: *"Getting weather status for Mumbai..."*.
*   **Cookie-Based State**: Refactored the entire app to store the selected city in cookies. This keeps the URL looking clean (`https://next-weather-sable.vercel.app/`) while still remembering your location.

### 🐛 **Bug Fixes & Cleanup**
*   **Security & Stability**: 
    *   Added support for multiple API key naming conventions (fallback to `NEXT_PUBLIC_`).
    *   Implemented server-side logging for easier debugging of environment variables in Vercel.
*   **UI/UX Polishing**: Fixed mobile navigation bugs where the menu would unexpectedly open when switching units or using geolocation.
*   **Null Safety**: Added robust checks for missing weather data to prevent app crashes.
*   **Performance Optimization**: Completely removed `next-themes` and all theme-switching logic. This reduced the bundle size and simplified the provider tree for faster loading and a more focused "glassmorphism" experience.

---

## 📸 Screenshots

![Next Weather App Interface](public/app-screenshot.png)

---

🌟 **Star this repo if you find it useful!**
