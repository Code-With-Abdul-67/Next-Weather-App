"use client";

import { useEffect, useState } from "react";
import { useLoading } from "@/context/loading-context";

export const LoadingOverlay = ({ initialCity }) => {
  const { isLoading, loadingMeta } = useLoading();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const cityToShow = loadingMeta?.city || initialCity || "City";
  
  const loadingText = progress < 30 
    ? `Getting weather status for ${cityToShow}...`
    : progress < 60 
    ? "Analyzing Atmosphere..." 
    : progress < 90 
    ? "Predicting Forecast..." 
    : "Finalizing...";

  useEffect(() => {
    let interval;

    if (isLoading || isInitialLoad) {
      setIsVisible(true);
      if (!isVisible) setProgress(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          
          const remaining = 90 - prev;
          const randomBase = Math.random() * 1.5; 
          const step = Math.min(remaining, Math.max(0.1, (remaining * 0.015) + (randomBase * 0.2)));
          
          return prev + step;
        });
      }, 100);

    } else {
      if (isVisible) {
        interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setIsVisible(false);
                setProgress(0);
              }, 600);
              return 100;
            }
            
            const remaining = 100 - prev;
            const step = Math.max(1, remaining * 0.1); 
            
            return Math.min(100, prev + step);
          });
        }, 20); 
      }
    }
    
    return () => clearInterval(interval);
  }, [isLoading, isVisible, isInitialLoad]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl transition-all duration-500">
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative w-40 h-40 rounded-full bg-white/5 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex items-center justify-center shadow-inner">
          
          <svg className="w-full h-full -rotate-90 transform p-2">
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/10"
              style={{ width: "100%", height: "100%" }}
            />
            <circle
              cx="70"
              cy="70"
              r="60"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * progress) / 100}
              className="transition-all duration-300 ease-out" 
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-white drop-shadow-md">
              {Math.round(progress)}%
            </span>
            <span className="text-[10px] text-blue-300 mt-1 uppercase tracking-widest font-semibold opacity-80">
              {progress >= 100 ? "Ready" : "Loading"}
            </span>
          </div>
          
          <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute -inset-4 rounded-full border border-transparent border-t-white/20 border-r-white/20 animate-spin opacity-50" style={{ animationDuration: '6s' }}></div>
        </div>
        
        <div className="mt-8 text-white/90 font-medium tracking-widest uppercase text-sm animate-pulse flex flex-col items-center gap-2">
           <span>{loadingText}</span>
           <div className="flex gap-1 mt-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.5s' }} />
             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1.5s' }} />
             <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '600ms', animationDuration: '1.5s' }} />
           </div>
        </div>
      </div>
    </div>
  );
};
