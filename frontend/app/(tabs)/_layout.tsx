import React from "react";
import { View, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerHeader from "@/components/Header/Profile";
import { Ionicons } from "@expo/vector-icons";
/*
This function is the structure of the drawer(the menu that appears when you swipe to the right)
parameters:
props - all props are shared by navigators in order to share navigation data. (refer to docs: https://reactnavigation.org/docs/drawer-navigator/)
*/
function DrawerContent(props: any) {
  return (
    <View>
      {/* Custom Drawer Header that contains profile picture and says "Welcome (Username)"  */}
      <CustomDrawerHeader />
      {/* Drawer contents: Home, Profile/Account */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}
/*
This function is the structure of the content inside the drawer(Home, Profile/Account, ...etc)

*/
export default function TabLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: true }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      {/* 
        Each Drawer.Screen points to a tab in the drawer
        parameters:
        name - the name of the file we are pointing to
        drawerLabel - the label that shows in the drawer
        title - the label that shows in the header
        headerRight - the icon that shows in top right of the header (notification icon for now)

      */}
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
          headerRight: () => (
            <Ionicons
              name="notifications-outline"
              size={25}
              style={styles.Logo}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          drawerLabel: "Profile/Account",
          title: "Profile/Account",
          headerRight: () => (
            <Ionicons
              name="notifications-outline"
              size={25}
              style={styles.Logo}
            />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    padding: 20,
  },
  Logo: {
    marginRight: 20,
  },
});
