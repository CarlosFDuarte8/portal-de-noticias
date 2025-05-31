import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { PaperProvider, MD2LightTheme, MD3LightTheme } from "react-native-paper";
import { ConnectivityStatus } from "./src/components/ConnectivityStatus";
import ProviderContexts from "./src/contexts/ProviderContexts";
import StackRoutes from "./src/routes";
import { StatusBar } from "react-native";

const AppTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...DefaultTheme.colors,
    primary: "#2400ee",
    secondary: "#03dac6",
    background: "#f5f5f5",
    surface: "#ffffff",
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
      level1: "#f5f5f5", // Light background for level 1 elevation
      level2: "#e0e0e0", // Light background for level 2 elevation
      level3: "#bdbdbd", // Light background for level 3 elevation
      level4: "#9e9e9e", // Light background for level 4 elevation
      level5: "#757575", // Light background for level 5 elevation
    }
  },
};

export default function App() {

  return (
    <ProviderContexts>
      <PaperProvider theme={AppTheme}>
        <NavigationContainer theme={DefaultTheme}>
          <StatusBar animated barStyle="default" />
          <ConnectivityStatus />
          <StackRoutes />
        </NavigationContainer>
      </PaperProvider>
    </ProviderContexts>
  );
}
