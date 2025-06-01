"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [city, setCity] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (city.trim()) {
      try {
        setLoading(true);
        await router.push(`/?city=${encodeURIComponent(city)}`);
        setMenuOpen(false);
        setCity("");
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <nav className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-2 flex justify-between items-center shadow-md fixed top-0 left-0 z-50 h-14 md:h-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/rainfall.ico" alt="Logo" height="32" width="32" />
        <div className="text-white text-xl font-semibold tracking-wide">
          Next Weather
        </div>
      </div>

      {/* Search (Desktop) */}
      <div className="hidden md:flex items-center gap-3 max-w-md w-full">
        <input
          className="w-full px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all placeholder-gray-400 text-sm font-medium"
          placeholder="Search city..."
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          className="px-4 py-2 rounded-xl text-white border border-white/20 hover:bg-white/10 transition-all font-semibold text-sm"
          variant="ghost"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* GitHub Button */}
      <a
        href="https://github.com/Code-With-Abdul-67/Next-Weather-App"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all font-semibold text-sm "
        title="View on GitHub"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 0C5.37 0 0 5.373 0 12a12.03 12.03 0 008.207 11.387c.6.112.793-.262.793-.58v-2.217c-3.338.727-4.033-1.61-4.033-1.61-.546-1.385-1.334-1.755-1.334-1.755-1.09-.745.082-.73.082-.73 1.205.086 1.84 1.24 1.84 1.24 1.07 1.833 2.806 1.304 3.49.997.107-.783.42-1.305.763-1.605-2.665-.303-5.466-1.362-5.466-6.06 0-1.34.47-2.437 1.236-3.296-.124-.303-.536-1.522.117-3.174 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 016 0c2.29-1.552 3.296-1.23 3.296-1.23.655 1.652.243 2.87.12 3.174.77.86 1.236 1.957 1.236 3.296 0 4.71-2.804 5.754-5.475 6.05.43.372.823 1.104.823 2.225v3.293c0 .32.19.697.8.58A12.03 12.03 0 0024 12c0-6.627-5.373-12-12-12z"
          />
        </svg>
        <span>GitHub</span>
      </a>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`
          absolute top-full left-0 w-full bg-grey/10 backdrop-blur-md border-t border-white/20 px-4 py-4 flex flex-col gap-4 md:hidden z-40
          transition-all duration-300 ease-in-out
          ${menuOpen ? "max-h-[20rem] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
        `}
      >
        <input
          className="w-full px-4 py-2 rounded-xl bg-grey/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder-gray-400 text-sm font-medium"
          placeholder="Search city..."
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          className="px-4 py-2 rounded-xl text-white border border-white/bg-white/20 hover:bg-white/20 transition-all font-semibold text-sm"
          variant="ghost"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Bottom loading bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300 ease-in-out ${
          loading ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
    </nav>
  );
};
