import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/theme";

const THEME_KEY = "theme_preference"; // light | dark | system
const ThemeContext = createContext(null);

export function ThemeProvider({ children, skipHydration = false, initialPreference = "system" }) {
  const systemScheme = useColorScheme();

  const isTestEnv =
    typeof process !== "undefined" && process.env && process.env.NODE_ENV === "test";

  const shouldSkipHydration = skipHydration || isTestEnv;

  const [preference, setPreference] = useState(initialPreference);
  const [ready, setReady] = useState(shouldSkipHydration);

  useEffect(() => {
    if (shouldSkipHydration) return;

    let mounted = true;

    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (mounted && saved) setPreference(saved);
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [shouldSkipHydration]);

  const theme =
    preference === "system" ? (systemScheme ?? "light") : preference;

  const colors = Colors?.[theme] ?? Colors?.light ?? {};

  const setThemePreference = async (value) => {
    setPreference(value);
    try {
      await AsyncStorage.setItem(THEME_KEY, value);
    } catch (_) {}
  };

  const toggleTheme = async () => {
    const next = theme === "dark" ? "light" : "dark";
    await setThemePreference(next);
  };

  const value = useMemo(
    () => ({
      ready,
      theme,
      preference,
      colors,
      toggleTheme,
      setThemePreference,
      isDark: theme === "dark",
    }),
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
