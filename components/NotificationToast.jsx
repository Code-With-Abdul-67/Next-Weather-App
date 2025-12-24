"use client";

import { useEffect, useState } from "react";
import { useNotification } from "@/context/notification-context";
import { X, AlertCircle, CheckCircle } from "lucide-react";

export const NotificationToast = () => {
  const { notification, hideNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [notification]);

  if (!notification && !isVisible) return null;

  const isError = notification?.type === "error";
  
  return (
    <div 
      className={`fixed top-20 right-4 z-[110] transition-all duration-500 ease-in-out transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className={`
        relative flex items-center gap-3 px-5 py-4 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl border
        ${isError 
          ? "bg-red-500/10 border-red-500/30 text-white" 
          : "bg-blue-500/10 border-blue-500/30 text-white"
        }
        min-w-[300px] max-w-md
      `}>
        <div className={`absolute -inset-1 blur-xl opacity-20 ${isError ? "bg-red-500" : "bg-blue-500"}`}></div>

        <div className={`flex-shrink-0 p-2 rounded-full ${isError ? "bg-red-500/20" : "bg-blue-500/20"}`}>
          {isError ? <AlertCircle size={20} className="text-red-400" /> : <CheckCircle size={20} className="text-blue-400" />}
        </div>

        <div className="flex-1">
          <h4 className={`text-sm font-bold tracking-wide uppercase mb-0.5 ${isError ? "text-red-400" : "text-blue-400"}`}>
            {isError ? "Error" : "Success"}
          </h4>
          <p className="text-sm text-gray-200 font-medium">
            {notification?.message}
          </p>
        </div>

        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(hideNotification, 300);
          }}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-loading-bar" />
      </div>
    </div>
  );
};
