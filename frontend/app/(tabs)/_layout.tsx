import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from "./Home"; // Import the Home component
import ExpenseHistory from "./ExpenseHistory"; // Import the ExpenseHistory component

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
      <Tab.Screen
        name="expenseHistory"
        component={ExpenseHistory}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
