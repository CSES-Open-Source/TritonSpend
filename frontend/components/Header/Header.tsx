import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.headerContent}>
        <Text style={styles.Logo}>
          <Text style={styles.triton}>Triton</Text>
          <Text style={styles.spend}>Spend</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#000000",
  },
  headerContent: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  Logo: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 5,
    fontFamily: "System",
  },
  triton: {
    color: "#FFD700",
  },
  spend: {
    color: "#FFFFFF",
  },
});
