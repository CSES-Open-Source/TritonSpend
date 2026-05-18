import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from ".";
import History from "./History";
import Account from "./Account";
import Goals from "./Goals";
import Deals from "./Deals";
import { useAuth } from "@/context/authContext";
import { Redirect } from "expo-router";
import { shadows } from "@/constants/shadows";
import { useAppTheme } from "@/context/themeContext";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const { user } = useAuth();
  const { colors } = useAppTheme();

  if (!user) {
    return <Redirect href="/Login" />;
  }
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Platform.OS === "ios" ? 24 : 16,
          height: 64,
          borderRadius: 28,
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 0,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 8 : 6,
          ...shadows.tabBar,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -2,
        },
      }}
    >
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
        name="Deals"
        component={Deals}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetag-outline" size={size} color={color} />
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
