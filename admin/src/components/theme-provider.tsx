"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const initialized = useRef(false);

  // On mount: read from localStorage and sync state
  useEffect(() => {
    const saved = localStorage.getItem("shodai-admin-theme") as Theme;
    const resolved = (saved === "dark" || saved === "light")
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    initialized.current = true;
  }, []);

  // On theme change (after init): sync DOM + localStorage
  useEffect(() => {
    if (!initialized.current) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("shodai-admin-theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
