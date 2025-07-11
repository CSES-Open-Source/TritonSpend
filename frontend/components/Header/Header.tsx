import { View, Text, StyleSheet } from "react-native";

// Basic header that has logo, name of tab, and notifications button
export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.Logo}>
        <Text style={styles.triton}>Triton</Text>
        <Text style={styles.spend}>Spend</Text>
      </Text>
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
    backgroundColor: "#00629B",
  },
  Logo: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 5,
    color: "#FFFFFF",
    fontFamily: "System",
  },
  triton: {
    color: "#FFD700", // UCSD gold accent
  },
  spend: {
    color: "#FFFFFF",
  },
});
