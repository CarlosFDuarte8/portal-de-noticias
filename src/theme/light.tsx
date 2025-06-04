import { DefaultTheme } from "@react-navigation/native";
import { MD3LightTheme } from "react-native-paper";

const colors = {
  primary: "#2400ee",
  secondaryContainer: "#E8F0FE",
  secondary: "#03dac6",
  background: "#f5f5f5",
  surface: "#ffffff",
  surfaceVariant: "#ffffff",
  error: "#b00020",
  text: "#000000",
  onPrimary: "#ffffff",
  onSecondary: "#000000",
  onSurface: "#000000",
  onError: "#ffffff",
  disabled: "#9e9e9e",
  placeholder: "#9e9e9e",
  backdrop: "rgba(0, 0, 0, 0.5)",
  notification: "#f50057",
  tooltip: "#ffffff",
  elevetion: {
    level0: "transparent",
    level1: "#f5f5f5", 
    level2: "#e0e0e0", 
    level3: "#bdbdbd", 
    level4: "#9e9e9e",
    level5: "#757575", 
  },
};

export const light = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...DefaultTheme.colors,
    ...colors,
  },
};
