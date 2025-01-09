import { View, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerHeader from "@/components/Header/Profile";
import Header from "@/components/Header/Header";
import { Ionicons } from "@expo/vector-icons";
function DrawerContent(props: any) {
  return (
    <View>
      <CustomDrawerHeader />
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}
export default function TabLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: true }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          headerTitle: () => <Header />,
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
          headerTitle: () => <Header />,
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
