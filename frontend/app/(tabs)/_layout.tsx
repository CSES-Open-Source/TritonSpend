import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import TabTwoScreen from './explore';
import {Drawer} from "expo-router/drawer";
import CustomDrawerHeader from '@/components/Header/Profile';
import Header from '@/components/Header/Header';
import { Ionicons } from '@expo/vector-icons';
function DrawerContent(props: any) {
  return (
    <View >
      <CustomDrawerHeader />
      <DrawerContentScrollView { ...props}>
          <DrawerItemList {...props}/>
      </DrawerContentScrollView>
  
      </View>
   );
}
export default function TabLayout() {
  return(
      <Drawer
        screenOptions={{ headerShown: true }}
        drawerContent={(props) => <DrawerContent {...props} />}
      >
        <Drawer.Screen
            name="explore"
            options={{
                headerTitle: (props) => <Header />,
                headerRight: () => (
                    <Ionicons name="notifications-outline" size={25} style={styles.Logo}/> 

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
    fontWeight: 'bold',
    marginBottom: 20,
    padding:20,
  },
  Logo:{
    marginRight:20
  }
});