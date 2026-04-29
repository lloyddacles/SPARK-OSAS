"use client";

import { useGlobalState } from "@/lib/GlobalStateContext";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useGlobalState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  // Prevent flash by not rendering children until mounted
  // or just render but with default theme
  return (
    <div data-theme={theme} style={{ minHeight: "100vh" }}>
      {children}
    </div>
  );
}
