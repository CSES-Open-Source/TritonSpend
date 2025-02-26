import { View, StyleSheet, Text } from "react-native";

/*
  Logout button component, I made this because I felt like we would need this button again

 */
export default function LogOutButton() {
  return (
    <View style={styles.ButtonContainer}>
      <Text style={styles.logoutText}>Sign Out</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ButtonContainer: {
    width: "50%",
    backgroundColor: "#f5f1e7",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  logoutText: {
    color: "black",
    fontWeight: "500",
    fontSize: 20,
  },
});
