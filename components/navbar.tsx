'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const [city, setCity] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (city.trim()) {
      router.push(`/?city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <nav className="w-full bg-black/60 backdrop-blur-md border border-white/20 p-4 flex justify-between items-center shadow-lg">
      {/* Left: App Title */}
      <div className="text-white text-xl font-bold tracking-wide">
        WeatherNow
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded-full bg-gray-800/80 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Right: Unit Toggle and Open Source */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-red-600/80 text-white rounded-full hover:bg-red-700 transition-colors">
          Open Source
        </button>
      </div>
    </nav>
  );
};