import { Platform } from "react-native";

const tintColorLight = '#4F46E5';
const tintColorDark = '#4F46E5';


export const Colors = {
  light: {
    // ✅ existing (mos i prek, mos i fshi)
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    // ✅ added tokens (për UI konsistente)
    mutedText: "#6B7280",
    surface: "#F6F7FB",
    card: "#FFFFFF",
    border: "#E5E7EB",
    inputBg: "#FFFFFF",
    placeholder: "#9CA3AF",

    primary: tintColorLight,
    onPrimary: "#FFFFFF",

    danger: "#DC2626",
    overlay: "rgba(0,0,0,0.45)",
  },

  dark: {
    // ✅ existing
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    // ✅ added tokens
    mutedText: "#9CA3AF",
    surface: "#0F1113",
    card: "#1B1D1F",
    border: "#2A2E31",
    inputBg: "#1B1D1F",
    placeholder: "#7B8186",

    // NOTE: tintColorDark = "#fff" -> button bg e bardhë në dark (ok),
    // prandaj onPrimary duhet me qenë e errët që teksti të shihet.
    primary: tintColorDark,
    onPrimary: "#151718",

    danger: "#F87171",
    overlay: "rgba(0,0,0,0.60)",
  },
} as const;

// (opsionale) types për TypeScript, nëse don me i pas “strong typed”
export type ThemeName = keyof typeof Colors;
export type ThemeColors = (typeof Colors)["light"];

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
