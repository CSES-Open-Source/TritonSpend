import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from "./Home"; // Import the Home component
import ExpenseHistory from "./ExpenseHistory"; // Import the ExpenseHistory component
import LoginPage from "./Login";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={ExpenseHistory}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
