import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from "./Home"; // Import the Home component

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
