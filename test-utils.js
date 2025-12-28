import { fireEvent, render as rtlRender, waitFor } from "@testing-library/react-native";
import { ThemeProvider } from "./context/ThemeContext";

function Wrapper({ children }) {
  // ✅ skipHydration = s’pret AsyncStorage, s’ka act warnings, render-on direkt
  return (
    <ThemeProvider skipHydration initialPreference="light">
      {children}
    </ThemeProvider>
  );
}

export function render(ui, options) {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export { fireEvent, waitFor };
