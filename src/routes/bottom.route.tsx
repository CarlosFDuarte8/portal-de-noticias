import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FC } from "react";

import { Favorites, Home } from "../screens";
import { useFavorites } from "../contexts/FavoriteContext";

const Tab = createBottomTabNavigator();

const BottomTabNavigator: FC = () => {
  const { favorites } = useFavorites();
  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: "#fff",
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          headerTitle: "Portal de Notícias",
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "newspaper" : "newspaper-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          headerShown: true,
          headerTitle: "Meus Favoritos",
          tabBarLabel: "Favoritos",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarBadge: favorites.length > 0 ? favorites.length : undefined,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
