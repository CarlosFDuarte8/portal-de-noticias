import { DarkTheme } from "@react-navigation/native";
import { MD3DarkTheme } from "react-native-paper";

const colors = {
  primary: "#3700B3", // Azul mais escuro e rico
  // primary: "#2962FF", // Alternativa - azul elétrico vibrante
  // primary: "#1A73E8", // Alternativa - azul Google moderno
  secondary: "#03DAC6",
  background: "#121212",
  surface: "#1E1E1E",
  error: "#CF6679",
  text: "#E1E1E1",
  onPrimary: "#FFFFFF", 
  onSecondary: "#000000",
  onSurface: "#FFFFFF",
  onError: "#000000",
  disabled: "#7A7A7A",
  placeholder: "#9E9E9E",
  backdrop: "rgba(0, 0, 0, 0.7)",
  notification: "#FF80AB",
  tooltip: "#424242",
  elevation: { 
    level0: "transparent",
    level1: "#1E1E1E",
    level2: "#252525",
    level3: "#303030",
    level4: "#383838",
    level5: "#424242",
  },
};

export const dark = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    ...colors,
  },
};
