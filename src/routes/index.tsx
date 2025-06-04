import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Details, WebViewScreen } from "../screens";
import { RootStackParamList } from "../types/navigation";
import BottomTabNavigator from "./bottom.route";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackRoutes() {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="BottomTabNavigator"
      screenOptions={{
        headerShown: true,
        orientation: "portrait",
      }}
    >
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{ title: "Portal de Notícias", headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ title: "Detalhes", headerShown: false, headerTransparent: true }} 

      />
      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={{ title: "WebViewScreen", headerShown: false, headerTransparent: true }} 

      />
    </Stack.Navigator>
  );
}
