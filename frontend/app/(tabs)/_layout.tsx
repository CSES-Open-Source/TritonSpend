import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from ".";
import History from "./History"; // Import the History component
// import LoginPage from "../Login";
import Account from "./Account";
import Goals from "./Goals";
import { useAuth } from "@/context/authContext";
import { Redirect } from "expo-router";
const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/Login" />;
  }
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
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
        component={History}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Login"
        component={LoginPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in" size={size} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Goals"
        component={Goals}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="rocket" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
