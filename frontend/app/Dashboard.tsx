import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
const DashboardPage = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/user/logout", {
        method: "POST",
        credentials: "include", // Ensures cookies (session info) are sent along with the request
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Perform the redirect on the frontend
      window.location.href = "/Login"; // Or use any React Native navigation method if needed
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to your Dashboard</Text>
      <Text style={styles.infoText}>
        Your personalized content will appear here.
      </Text>

      {/* Log Out Button */}
      <Button title="Log Out" onPress={handleLogout} />
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
