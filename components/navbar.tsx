'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';

export const Navbar = () => {
  const [city, setCity] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (city.trim()) {
      router.push(`/?city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <nav className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex justify-between items-center shadow-lg fixed top-0 left-0 z-50">
      {/* Logo/Title */}
      <div className="text-white text-2xl font-bold tracking-wide">
        Next Weather
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 max-w-md w-full">
        <input
          type="text"
          placeholder="Search your city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-5 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder-gray-400 text-sm font-medium"
        />
        <Button
          onClick={handleSearch}
          color="secondary"
          variant="ghost"
          className="rounded-2xl px-6 py-3 text-white border border-white/20 hover:bg-white/20 transition-all font-bold"
        >
          Search
        </Button>
      </div>

      {/* Open Source Button */}
      <div className="flex gap-4">
        <button
          className="px-6 py-3 bg-white/10 text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all font-bold"
        >
          Open Source
        </button>
      </div>
    </nav>
  
  );
};