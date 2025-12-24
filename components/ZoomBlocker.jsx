"use client";

import { useEffect } from "react";

export function ZoomBlocker() {
  useEffect(() => {
    // Prevent zoom with Ctrl+Plus, Ctrl+Minus, Ctrl+Scroll
    const preventZoom = (e) => {
      if (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=" || e.keyCode === 61 || e.keyCode === 173 || e.keyCode === 107 || e.keyCode === 109)) {
        e.preventDefault();
      }
    };

    const preventScrollZoom = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("keydown", preventZoom);
    document.addEventListener("wheel", preventScrollZoom, { passive: false });

    // Cleanup
    return () => {
      document.removeEventListener("keydown", preventZoom);
      document.removeEventListener("wheel", preventScrollZoom);
    };
  }, []);

  return null;
}
