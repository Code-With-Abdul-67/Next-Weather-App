"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [city, setCity] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (city.trim()) {
      try {
        setLoading(true);
        await router.push(`/?city=${encodeURIComponent(city)}`);
        setMenuOpen(false);  // Close mobile menu
        setCity('');         // Clear search input
      } catch (error) {
        // Handle error if needed
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <nav className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex justify-between items-center shadow-lg fixed top-0 left-0 z-50">
      {/* Logo & title */}
      <div className="flex items-center gap-2">
        <img src="/rainfall.ico" alt="Logo" height="40px" width="40px" />
        <div className="text-white text-2xl font-bold tracking-wide">
          Next Weather
        </div>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-4 max-w-md w-full">
        <input
          className="w-full px-5 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder-gray-400 text-sm font-medium"
          placeholder="Search your city name..."
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button
          className="rounded-2xl px-6 py-3 text-white border border-white/20 hover:bg-white/20 transition-all font-bold"
          color="default"
          variant="ghost"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* GitHub link */}
      <a
        href="https://github.com/Code-With-Abdul-67/Next-Weather-App"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-3 px-5 py-3 bg-white/10 text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all font-semibold"
        title="View on GitHub"
      >
        {/* GitHub Icon */}
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M12 0C5.37 0 0 5.373 0 12a12.03 12.03 0 008.207 11.387c.6.112.793-.262.793-.58v-2.217c-3.338.727-4.033-1.61-4.033-1.61-.546-1.385-1.334-1.755-1.334-1.755-1.09-.745.082-.73.082-.73 1.205.086 1.84 1.24 1.84 1.24 1.07 1.833 2.806 1.304 3.49.997.107-.783.42-1.305.763-1.605-2.665-.303-5.466-1.362-5.466-6.06 0-1.34.47-2.437 1.236-3.296-.124-.303-.536-1.522.117-3.174 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 016 0c2.29-1.552 3.296-1.23 3.296-1.23.655 1.652.243 2.87.12 3.174.77.86 1.236 1.957 1.236 3.296 0 4.71-2.804 5.754-5.475 6.05.43.372.823 1.104.823 2.225v3.293c0 .32.19.697.8.58A12.03 12.03 0 0024 12c0-6.627-5.373-12-12-12z"
            clipRule="evenodd"
          />
        </svg>
        <span>Open Source</span>
      </a>

      {/* Mobile Hamburger Icon */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`
          absolute top-full left-0 w-full bg-white/10 backdrop-blur-md border-t border-white/20 px-6 py-4 flex flex-col gap-4 md:hidden z-40
          overflow-hidden
          transition-all duration-300 ease-in-out
          ${menuOpen
            ? "max-h-[24rem] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
          }
        `}
      >
        <input
          className="w-full px-5 py-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder-gray-400 text-sm font-medium"
          placeholder="Search your city name..."
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button
          className="rounded-2xl px-6 py-3 text-white border border-white/20 hover:bg-white/20 transition-all font-bold"
          color="default"
          variant="ghost"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* Loading bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300 ease-in-out ${
          loading ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      ></div>
    </nav>
  );
};
