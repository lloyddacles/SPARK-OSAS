"use client";

import { useGlobalState } from "@/lib/GlobalStateContext";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, currentUser } = useGlobalState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // 🎨 Institutional Department Color Mapping
    const DEPARTMENT_COLORS: Record<string, string> = {
      "BSIS": "#1e3a8a",   // Dark Blue
      "BSE": "#800000",    // Maroon
      "BSTM": "#7e22ce",   // Purple
      "BSCRIM": "#f97316", // Orange
      "BSA": "#eab308",    // Yellow
      "BSAIS": "#eab308",  // Yellow
      "SHS": "#16a34a"     // Green
    };

    const userProgram = currentUser?.program?.toUpperCase() || "";
    let primaryColor = "#00e5ff"; // Default Sapphire
    
    // Find matching program color
    for (const [dept, color] of Object.entries(DEPARTMENT_COLORS)) {
      if (userProgram.includes(dept)) {
        primaryColor = color;
        break;
      }
    }

    // Inject CSS Variables
    document.documentElement.style.setProperty("--primary", primaryColor);
    document.documentElement.style.setProperty("--primary-glow", `${primaryColor}33`); // 20% opacity
    document.documentElement.setAttribute("data-theme", theme);
    
  }, [theme, mounted, currentUser]);

  return (
    <div data-theme={theme} className="theme-transition" style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
