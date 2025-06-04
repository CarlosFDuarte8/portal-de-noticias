import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";

import { dark } from "./dark";
import { light } from "./light";


export const ThemeProvider = ({ children, isDarkMode }: { children: React.ReactNode; isDarkMode: boolean }) => {
  return (
    <PaperProvider theme={isDarkMode ? dark : light}>
      <NavigationContainer theme={isDarkMode ? dark : light}>
        {children}
      </NavigationContainer>
    </PaperProvider>
  );
}
