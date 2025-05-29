import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Details } from "../screens";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackRoutes() {
  return (
    <Stack.Navigator
      id={undefined}
      initialRouteName="Home"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: "Portal de Notícias" }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ title: "Detalhes" }}
      />
    </Stack.Navigator>
  );
}
