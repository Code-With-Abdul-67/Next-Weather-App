"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { useLoading } from "@/context/loading-context";

export const Navbar = () => {
  const [city, setCity] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoading: loading, startLoading, stopLoading } = useLoading();
  // Helper to maintain compatibility with existing code
  const setLoading = (val) => val ? startLoading() : stopLoading();
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);
  const searchTimeout = useRef(null);

  const handleCityChange = async (value) => {
    setCity(value);
    
    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim().length >= 2) {
      setSearchLoading(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/cities?q=${encodeURIComponent(value)}`);
          const data = await response.json();
          
          if (data.cities) {
            setSuggestions(data.cities);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300); 
    }
  };

  const handleSearch = async (cityName = city) => {
    if (cityName.trim()) {
      try {
        setLoading(true);
        await router.push(`/?city=${encodeURIComponent(cityName)}`);
        setMenuOpen(false);
        setCity("");
        setSuggestions([]);
        setShowSuggestions(false);
      } catch (error) {
        console.error("Navigation error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSuggestionClick = (cityName) => {
    setCity(cityName);
    setShowSuggestions(false);
    handleSearch(cityName);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex].name);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      
      const isOutsideDesktop = 
        suggestionsRef.current && 
        !suggestionsRef.current.contains(target) && 
        !inputRef.current?.contains(target);

      const isOutsideMobile = 
        mobileSuggestionsRef.current && 
        !mobileSuggestionsRef.current.contains(target) && 
        !mobileInputRef.current?.contains(target);

      // We only close if it's outside BOTH (checking existence to handle different layout states)
      // If mobile menu is open, we care about mobile ref. If desktop, desktop ref.
      // Simplest safety: if it's NOT in any known suggestion container or input, close it.
      
      const inDesktop = (suggestionsRef.current?.contains(target) || inputRef.current?.contains(target));
      const inMobile = (mobileSuggestionsRef.current?.contains(target) || mobileInputRef.current?.contains(target));

      if (!inDesktop && !inMobile) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-2 flex justify-between items-center shadow-md fixed top-0 left-0 z-50 h-14 md:h-16">
      <div className="flex items-center gap-2">
        <AppLogo className="w-10 h-10" />
        <div className="text-white text-xl font-semibold tracking-wide">
          Next Weather
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 max-w-md w-full relative">
        <div className="relative w-full">
          <input
            ref={inputRef}
            className="w-full px-4 py-2 rounded-xl bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all placeholder-gray-400 text-sm font-medium"
            placeholder="Type any city name..."
            type="text"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => city.trim() && setShowSuggestions(true)}
          />
          
          {searchLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
          
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full mt-2 w-full bg-gradient-to-b from-black/60 via-black/70 to-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] overflow-hidden z-50 ring-1 ring-white/10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none max-h-96 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.name}-${suggestion.country}-${index}`}
                  className={`px-4 py-3.5 cursor-pointer transition-all duration-200 backdrop-blur-sm relative ${
                    index === selectedIndex
                      ? "bg-gradient-to-r from-blue-500/30 via-blue-600/25 to-blue-500/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                      : "hover:bg-white/10 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  } ${index !== suggestions.length - 1 ? "border-b border-white/10" : ""}`}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-white font-semibold text-sm drop-shadow-sm">
                      {suggestion.name}
                    </span>
                    <span className="text-gray-400 text-xs font-medium bg-white/5 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {suggestion.state ? `${suggestion.state}, ${suggestion.country}` : suggestion.country}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <a
        href="https://github.com/Code-With-Abdul-67/Next-Weather-App"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-white border border-white/20 hover:bg-blue-500/10 transition-all font-semibold text-sm"
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
      </a>

      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`
          absolute top-full left-0 w-full bg-black/20 backdrop-blur-md border-t border-white/20 px-4 py-4 flex flex-col gap-4 md:hidden z-40
          transition-all duration-300 ease-in-out
          ${menuOpen ? "max-h-[30rem] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
        `}
      >
        <div className="relative w-full">
          <input
            ref={mobileInputRef}
            className="w-full px-4 py-2 rounded-xl bg-black/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all placeholder-gray-400 text-sm font-medium"
            placeholder="Type any city name..."
            type="text"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => city.trim() && setShowSuggestions(true)}
          />
          
          {searchLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
          
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={mobileSuggestionsRef}
              className="mt-2 w-full bg-gradient-to-b from-black/60 via-black/70 to-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] overflow-hidden ring-1 ring-white/10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none relative max-h-64 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={`mobile-${suggestion.name}-${suggestion.country}-${index}`}
                  className={`px-4 py-3.5 cursor-pointer transition-all duration-200 backdrop-blur-sm relative ${
                    index === selectedIndex
                      ? "bg-gradient-to-r from-blue-500/30 via-blue-600/25 to-blue-500/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                      : "hover:bg-white/10 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  } ${index !== suggestions.length - 1 ? "border-b border-white/10" : ""}`}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-white font-semibold text-sm drop-shadow-sm">
                      {suggestion.name}
                    </span>
                    <span className="text-gray-400 text-xs font-medium bg-white/5 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {suggestion.state ? `${suggestion.state}, ${suggestion.country}` : suggestion.country}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300 ease-in-out ${
          loading ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
    </nav>
  );
};
