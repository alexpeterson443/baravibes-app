import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useTheme } from "./ThemeContext";

export interface UserPrefs {
  theme: "light" | "dark";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  showCursorTrail: number;
}

const defaultPrefs: UserPrefs = {
  theme: "light",
  accentColor: "brown",
  fontSize: "medium",
  showCursorTrail: 1,
};

// Accent color CSS variable mappings
const accentColorMap: Record<string, { primary: string; primaryFg: string; ring: string }> = {
  brown: {
    primary: "oklch(0.45 0.08 55)",
    primaryFg: "oklch(0.98 0.01 85)",
    ring: "oklch(0.45 0.08 55)",
  },
  green: {
    primary: "oklch(0.45 0.12 145)",
    primaryFg: "oklch(0.98 0.01 145)",
    ring: "oklch(0.45 0.12 145)",
  },
  pink: {
    primary: "oklch(0.55 0.18 10)",
    primaryFg: "oklch(0.98 0.01 10)",
    ring: "oklch(0.55 0.18 10)",
  },
  blue: {
    primary: "oklch(0.45 0.15 240)",
    primaryFg: "oklch(0.98 0.01 240)",
    ring: "oklch(0.45 0.15 240)",
  },
  purple: {
    primary: "oklch(0.45 0.15 300)",
    primaryFg: "oklch(0.98 0.01 300)",
    ring: "oklch(0.45 0.15 300)",
  },
  orange: {
    primary: "oklch(0.55 0.15 55)",
    primaryFg: "oklch(0.98 0.01 55)",
    ring: "oklch(0.55 0.15 55)",
  },
};

// Font size CSS variable mappings
const fontSizeMap: Record<string, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

interface PreferencesContextType {
  prefs: UserPrefs;
  loaded: boolean;
}

const PreferencesContext = createContext<PreferencesContextType>({
  prefs: defaultPrefs,
  loaded: false,
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { toggleTheme, theme: currentTheme } = useTheme();
  const [prefs, setPrefs] = useState<UserPrefs>(() => {
    // Try loading from localStorage first for instant application
    try {
      const stored = localStorage.getItem("baravibes-prefs");
      if (stored) return JSON.parse(stored);
    } catch {}
    return defaultPrefs;
  });
  const [loaded, setLoaded] = useState(false);

  const prefsQuery = trpc.preferences.get.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Apply preferences to DOM
  const applyPrefs = useCallback((p: UserPrefs) => {
    const root = document.documentElement;

    // Apply accent color
    const colors = accentColorMap[p.accentColor] || accentColorMap.brown;
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryFg);
    root.style.setProperty("--ring", colors.ring);
    root.style.setProperty("--sidebar-primary", colors.primary);
    root.style.setProperty("--sidebar-primary-foreground", colors.primaryFg);
    root.style.setProperty("--sidebar-ring", colors.ring);

    // Apply font size
    root.style.fontSize = fontSizeMap[p.fontSize] || fontSizeMap.medium;

    // Apply cursor trail preference
    root.dataset.cursorTrail = p.showCursorTrail ? "on" : "off";
  }, []);

  // When server prefs load, update state and localStorage
  useEffect(() => {
    if (prefsQuery.data) {
      const serverPrefs: UserPrefs = {
        theme: (prefsQuery.data.theme as "light" | "dark") || "light",
        accentColor: prefsQuery.data.accentColor || "brown",
        fontSize: (prefsQuery.data.fontSize as "small" | "medium" | "large") || "medium",
        showCursorTrail: prefsQuery.data.showCursorTrail ?? 1,
      };
      setPrefs(serverPrefs);
      localStorage.setItem("baravibes-prefs", JSON.stringify(serverPrefs));
      setLoaded(true);
    }
  }, [prefsQuery.data]);

  // Apply preferences whenever they change
  useEffect(() => {
    applyPrefs(prefs);

    // Sync theme with ThemeProvider
    if (toggleTheme && prefs.theme !== currentTheme) {
      toggleTheme();
    }
  }, [prefs, applyPrefs]);

  // When user logs out, reset to defaults
  useEffect(() => {
    if (!isAuthenticated && loaded) {
      setPrefs(defaultPrefs);
      localStorage.removeItem("baravibes-prefs");
      applyPrefs(defaultPrefs);
      setLoaded(false);
    }
  }, [isAuthenticated, loaded, applyPrefs]);

  // Listen for localStorage changes from Settings page
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "baravibes-prefs" && e.newValue) {
        try {
          const newPrefs = JSON.parse(e.newValue);
          setPrefs(newPrefs);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <PreferencesContext.Provider value={{ prefs, loaded }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
