"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

export const Navbar = () => {
  const [city, setCity] = useState<string>("");
  const router = useRouter();

  const handleSearch = () => {
    if (city.trim()) {
      try {
        router.push(`/?city=${encodeURIComponent(city)}`);
      } catch (error) {
        // Removed console.warn to fix no-console warning
        // If you need to debug, consider using a logging service or environment-based logging
      }
    }
  };

  return (
    <nav className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex justify-between items-center shadow-lg fixed top-0 left-0 z-50">
      <div className="text-white text-2xl font-bold tracking-wide">
        Next Weather
      </div>
      <div className="flex items-center gap-4 max-w-md w-full">
        <input
          className="w-full px-5 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder-gray-400 text-sm font-medium"
          placeholder="Search your city name..."
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)} // Moved callback to last
        />
        <Button
          className="rounded-2xl px-6 py-3 text-white border border-white/20 hover:bg-white/20 transition-all font-bold"
          color="secondary"
          variant="ghost"
          onClick={handleSearch} // Moved callback to last
        >
          Search
        </Button>
      </div>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-white/10 text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all font-bold">
          Open Source
        </button>
      </div>
    </nav>
  );
};