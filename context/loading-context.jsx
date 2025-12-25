"use client";

import { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext({
  isLoading: false,
  loadingMeta: {},
  startLoading: () => {},
  stopLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState({});

  const startLoading = useCallback((meta = {}) => {
    setLoadingMeta(meta);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    // Optional: clear meta after a delay if needed, 
    // but clearing it here ensures next load starts fresh or with new meta
    setLoadingMeta({});
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, loadingMeta, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
