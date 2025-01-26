//imports: npm & npm install @react-native-picker/picker
// put it into components and then import that into index
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

//the category for the dropdown
const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(
    "Spending Categories",
  );

  //drop down menu
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Spending Category</Text>

      {/* Dropdown for food categories */}
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)} // Update category based on what you pick
        style={styles.picker}
      >
        {/* Food categories */}
        <Picker.Item label="Food" value="food" />
        <Picker.Item label="Drinks" value="drinks" />
        <Picker.Item label="Entertainment" value="entertainment" />
        <Picker.Item label="Groceries" value="groceries" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <Text style={styles.selectedValue}>You selected: {selectedCategory}</Text>
    </View>
  );
};

// Define styles using StyleSheet.create()
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  picker: {
    width: 300,
    height: 50,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedValue: {
    fontSize: 18,
    color: "#555",
    marginTop: 10,
  },
});

export default App; // exports it to the app to be tested on the local host
