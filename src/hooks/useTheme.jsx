import { createContext, useContext, useState, useCallback } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "lingoxic_theme";

function getInitialDark() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark") return true;
    if (saved === "light") return false;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(getInitialDark);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      } catch {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ darkMode, sidebarOpen, toggleDarkMode, setSidebarOpen }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
