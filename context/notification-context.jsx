"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

const NotificationContext = createContext({
  notification: null,
  showNotification: () => {},
  hideNotification: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  const showNotification = useCallback((message, type = "error") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setNotification({ message, type });

    // Auto hide after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []);

  const hideNotification = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
