import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Details } from "../screens";
import { RootStackParamList } from "../types/navigation";
import BottomTabNavigator from "./bottom.route";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackRoutes() {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="BottomTabNavigator"
      screenOptions={{ headerShown: true, orientation: "portrait" }}
    >
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{ title: "Portal de Notícias", headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ title: "Detalhes" }}
      />
    </Stack.Navigator>
  );
}
