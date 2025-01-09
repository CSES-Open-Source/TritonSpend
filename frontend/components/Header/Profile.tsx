import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

/*
  Custom drawer header function that has profile picture, username, and account settings
*/
const CustomDrawerHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={{ uri: "(profile picture)" }}
        style={styles.profileImage}
      />
      <Text style={styles.headerText}>Welcome, (username)</Text>
      <Text style={styles.subHeaderText}>Account settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2196f3",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: "white", //delete later
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  subHeaderText: {
    fontSize: 14,
    color: "#fff",
  },
});

export default CustomDrawerHeader;
