import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/theme";

const THEME_KEY = "theme_preference"; // light | dark | system
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved) setPreference(saved);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const theme = preference === "system" ? (systemScheme ?? "light") : preference;
  const colors = Colors[theme];

  const setThemePreference = async (value) => {
    setPreference(value);
    await AsyncStorage.setItem(THEME_KEY, value);
  };

  const toggleTheme = async () => {
    const next = theme === "dark" ? "light" : "dark";
    await setThemePreference(next);
  };

  const value = useMemo(
    () => ({ ready, theme, preference, colors, toggleTheme, setThemePreference, isDark: theme === "dark" }),
    [ready, theme, preference, colors]
  );

  if (!ready) return null;
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
