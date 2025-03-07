// src/DashboardPage.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const DashboardPage = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status here
    // Set `isAuthenticated` based on actual logic
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to your Dashboard</Text>
      <Text style={styles.infoText}>
        Your personalized content will appear here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    color: "#555",
  },
});

export default DashboardPage;
