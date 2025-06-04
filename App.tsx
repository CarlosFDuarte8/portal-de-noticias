import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";

import { ConnectivityStatus } from "./src/components/ConnectivityStatus";
import ProviderContexts from "./src/contexts/ProviderContexts";
import StackRoutes from "./src/routes";
import { light } from "./src/theme/light";

export default function App() {
  return (
    <ProviderContexts>
      <PaperProvider theme={light}>
        <NavigationContainer theme={light}>
          <StatusBar animated barStyle="default" />
          <ConnectivityStatus />
          <StackRoutes />
        </NavigationContainer>
      </PaperProvider>
    </ProviderContexts>
  );
}
