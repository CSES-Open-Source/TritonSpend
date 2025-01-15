import { View, Text, StyleSheet } from "react-native";

// Basic header that haws logo, name of tab, and notifications button
export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.Logo}>(Logo)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  Logo: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
