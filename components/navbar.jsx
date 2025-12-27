"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, MapPin, Heart, Trash2, Thermometer } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { useLoading } from "@/context/loading-context";
import { updateCity, updateUnit } from "@/app/actions";

export const Navbar = () => {
  const [city, setCity] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoading: loading, startLoading, stopLoading } = useLoading();
  // Helper to maintain compatibility with existing code while supporting metadata
  const setLoading = (val, meta = {}) => val ? startLoading(meta) : stopLoading();
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchLoading, setSearchLoading] = useState(false);
  // const router = useRouter();
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);
  const searchTimeout = useRef(null);

  // Feature states
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isMetric, setIsMetric] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("weather_favorites");
    if (saved) setFavorites(JSON.parse(saved));
    
    // Check cookie for unit or default to metric (simplified)
    const unitCookie = document.cookie.split('; ').find(row => row.startsWith('units='));
    if (unitCookie) {
       setIsMetric(unitCookie.split('=')[1] === 'metric');
    }
  }, []);

  const toggleUnit = async () => {
    const newUnit = isMetric ? "imperial" : "metric";
    setIsMetric(!isMetric);
    setLoading(true, { city: "Updating Units" });
    await updateUnit(newUnit);
    setLoading(false);
  };

  const saveFavorite = (suggestion) => {
    // Create a unique key: "London, GB" or "London, Ontario, CA"
    const uniqueName = suggestion.state 
        ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
        : `${suggestion.name}, ${suggestion.country}`;
    
    let newFavs;
    if (favorites.includes(uniqueName)) {
      newFavs = favorites.filter(f => f !== uniqueName);
    } else {
      newFavs = [...favorites, uniqueName];
    }
    setFavorites(newFavs);
    localStorage.setItem("weather_favorites", JSON.stringify(newFavs));
  };

  const removeFavorite = (cityName, e) => {
    if (e) e.stopPropagation();
    const newFavs = favorites.filter(f => f !== cityName);
    setFavorites(newFavs);
    localStorage.setItem("weather_favorites", JSON.stringify(newFavs));
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true, { city: "Current Location" });
      
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await updateCity({ lat: latitude, lon: longitude });
            setMenuOpen(false);
          } catch (error) {
            console.error(error);
            alert("Error updating location weather.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          // Geolocation error objects don't log well as JSON, so we log properties manually
          console.error(`Geolocation error (${error.code}): ${error.message}`);
          setLoading(false);
          
          let message = "Unable to retrieve your location.";
          if (error.code === 1) {
            message = "Location access denied. Please enable it in browser settings.";
          } else if (error.code === 2) {
            message = "Location information is unavailable (your device might not have GPS or a clear signal).";
          } else if (error.code === 3) {
            message = "Location request timed out. Please try again.";
          }
          
          alert(message);
        },
        options
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

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
        setLoading(true, { city: cityName });
        await updateCity(cityName);
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
    <nav className="w-full bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-2 flex justify-between items-center shadow-2xl fixed top-0 left-0 z-50 h-14 md:h-16">
      <div className="flex items-center gap-2">
        <AppLogo className="w-10 h-10" />
        <div className="text-white text-xl font-semibold tracking-wide">
          Next Weather
        </div>
      </div>

      {/* Desktop Layout: Centered Search + Icons */}
      <div className="hidden md:flex flex-1 justify-center items-center pointer-events-none">
        <div className="flex items-center gap-4 max-w-6xl w-full pointer-events-auto">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              className="w-full pl-10 pr-4 py-2 rounded-3xl bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-400 text-lg font-bold backdrop-blur-sm font-cursive"
              placeholder="Search for a city..."
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
                    className={`px-4 py-3.5 cursor-pointer transition-all duration-200 backdrop-blur-sm relative font-mono ${
                      index === selectedIndex
                        ? "bg-gradient-to-r from-blue-500/30 via-blue-600/25 to-blue-500/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                        : "hover:bg-white/10 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                    } ${index !== suggestions.length - 1 ? "border-b border-white/10" : ""}`}
                    onClick={() => handleSuggestionClick(suggestion.name)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center justify-between relative z-10 w-full">
                      <div className="flex flex-col">
                          <span className="text-white font-bold text-lg drop-shadow-sm">
                          {suggestion.name}
                          </span>
                          <span className="text-gray-300 text-sm font-semibold">
                          {suggestion.state ? `${suggestion.state}, ${suggestion.country}` : suggestion.country}
                          </span>
                      </div>
                      <button
                          onClick={(e) => {
                              e.stopPropagation();
                              saveFavorite(suggestion);
                          }}
                          className="p-2 hover:bg-white/10 rounded-full transition-all"
                      >
                          <Heart 
                              className={`w-5 h-5 ${
                                  favorites.includes(
                                      suggestion.state 
                                      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
                                      : `${suggestion.name}, ${suggestion.country}`
                                  ) ? "text-red-500 fill-current" : "text-gray-400"}`} 
                          />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleLocationClick}
              className="flex items-center justify-center p-2 rounded-xl text-white border border-white/20 hover:bg-blue-500/10 transition-all focus:ring-2 focus:ring-blue-400/40"
              title="Use My Location"
            >
              <MapPin className="w-5 h-5" />
            </button>

            <button
              onClick={toggleUnit}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-white border border-white/20 hover:bg-blue-500/10 transition-all font-bold text-sm focus:ring-2 focus:ring-blue-400/40"
              title="Toggle Units"
            >
              {isMetric ? "°C" : "°F"}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="flex items-center justify-center p-2 rounded-xl text-white border border-white/20 hover:bg-red-500/10 transition-all focus:ring-2 focus:ring-red-400/40"
                title="Favorites"
              >
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              </button>
              
              {showFavorites && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
                  {favorites.length === 0 ? (
                    <div className="p-6 text-gray-400 text-sm text-center">No favorites saved</div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {favorites.map((fav) => (
                        <div
                          key={fav}
                          className="flex justify-between items-center px-4 py-3.5 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-none transition-colors"
                          onClick={() => {
                            handleSearch(fav);
                            setShowFavorites(false);
                          }}
                        >
                          <span className="text-white text-sm font-medium truncate flex-1">{fav}</span>
                          <button
                            onClick={(e) => removeFavorite(fav, e)}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Empty spacer for balancing the left-aligned logo */}
      <div className="hidden md:block w-32 shrink-0" />




      <div className="md:hidden flex items-center gap-2">
        <button 
          onClick={handleLocationClick}
          className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
          title="Use My Location"
        >
          <MapPin size={20} />
        </button>
        <button 
          onClick={toggleUnit}
          className="font-bold text-sm p-2 text-white hover:bg-white/10 rounded-xl transition-colors w-10 text-center"
          title="Toggle Units"
        >
          {isMetric ? "°C" : "°F"}
        </button>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
          title="Favorites"
        >
          <Heart size={20} className={`${favorites.length > 0 ? "text-red-500 fill-current" : "text-gray-400"}`} />
        </button>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-xl transition-colors ml-1"
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={mobileInputRef}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-400 text-lg font-bold backdrop-blur-sm font-mono"
            placeholder="Search for a city..."
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
                  className={`px-4 py-3.5 cursor-pointer transition-all duration-200 backdrop-blur-sm relative font-mono ${
                    index === selectedIndex
                      ? "bg-gradient-to-r from-blue-500/30 via-blue-600/25 to-blue-500/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                      : "hover:bg-white/10 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  } ${index !== suggestions.length - 1 ? "border-b border-white/10" : ""}`}
                  onClick={() => handleSuggestionClick(suggestion.name)}
                >
                  <div className="flex items-center justify-between relative z-10 w-full">
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-lg drop-shadow-sm">
                        {suggestion.name}
                        </span>
                        <span className="text-gray-300 text-sm font-semibold">
                        {suggestion.state ? `${suggestion.state}, ${suggestion.country}` : suggestion.country}
                        </span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            saveFavorite(suggestion);
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-all"
                    >
                         <Heart 
                            className={`w-5 h-5 ${
                                favorites.includes(
                                    suggestion.state 
                                    ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
                                    : `${suggestion.name}, ${suggestion.country}`
                                ) ? "text-red-500 fill-current" : "text-gray-400"}`} 
                        />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-2 border-t border-white/10 pt-4 flex flex-col gap-2">
            <h3 className="text-white/70 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 px-1">
              <Heart size={12} className="text-red-500 fill-current" /> Favorite Cities
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
              {favorites.map((fav) => (
                <div
                  key={`mobile-fav-${fav}`}
                  className="flex justify-between items-center px-4 py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-xl border border-white/5 transition-all group"
                  onClick={() => handleSearch(fav)}
                >
                  <span className="text-white text-sm font-medium truncate flex-1">{fav}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav);
                    }}
                    className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={`absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300 ease-in-out ${
          loading ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
    </nav>
  );
};
