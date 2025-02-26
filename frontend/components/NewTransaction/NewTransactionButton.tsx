import {
  View,
  StyleSheet,
  Text,
  Animated,
  Pressable,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import { Picker } from "@react-native-picker/picker";

//button that expands and shows a text input for recent transactions
export default function NewTransactionButton() {
  //usestate for expanding button, if true, button is expanded, initially set to false
  const [inputVisible, setInputVisible] = useState(false);
  //refs for animation(X icon rotating, button expanding... etc)
  const rotation = useRef(new Animated.Value(0)).current;
  const inputShow = useRef(new Animated.Value(-20)).current;
  const expand = useRef(new Animated.Value(50)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  //rotation iterpolate for X icon
  const interpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  //for the selected category and the transaction amount
  const [selectedCategory, setSelectedCategory] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");

  //toggle function for buttion, starts all animation when toggled and sets inputVisible accordingly
  function toggle() {
    setInputVisible(!inputVisible);
    Animated.spring(rotation, {
      toValue: inputVisible ? 0 : 1,
      tension: 100,
      useNativeDriver: true,
    }).start();
    Animated.spring(expand, {
      toValue: inputVisible ? 50 : 210,
      tension: 40,
      useNativeDriver: false,
    }).start();
    Animated.timing(inputShow, {
      toValue: inputVisible ? -20 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(animatedOpacity, {
      toValue: inputVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }
  return (
    <Animated.View style={[styles.newTransaction, { height: expand }]}>
      <Pressable onPress={toggle}>
        <View style={[styles.button]}>
          <Text style={styles.Title}>New Transaction</Text>
          <Animated.View style={{ transform: [{ rotate: interpolate }] }}>
            <MaterialIcons name="add-circle-outline" size={35} />
          </Animated.View>
        </View>
      </Pressable>
      {inputVisible ? (
        <Animated.View
          style={[
            styles.inputContainer,
            {
              transform: [{ translateY: inputShow }],
              opacity: animatedOpacity,
            },
          ]}
        >
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Food" value="food" />
            <Picker.Item label="Drinks" value="drinks" />
            <Picker.Item label="Entertainment" value="entertainment" />
            <Picker.Item label="Groceries" value="groceries" />
            <Picker.Item label="Other" value="other" />
          </Picker>

          <TextInput style={styles.textInput} placeholder="Item Information" />

          <TextInput
            style={styles.textInput}
            placeholder="Transaction Amount"
            keyboardType="numeric"
            value={transactionAmount}
            onChangeText={(text) => {
              // Allow only numeric values
              if (/^\d*\.?\d*$/.test(text)) {
                setTransactionAmount(text);
              }
            }}
          />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  newTransaction: {
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 10,
    cursor: "pointer",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  Title: {
    fontWeight: "bold",
    fontSize: 17,
  },
  inputContainer: {
    width: "90%",
  },
  textInput: {
    width: "100%",
    borderWidth: 3,
    borderRadius: 10,
    padding: 10,
    borderColor: "#E5E5E5",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  picker: {
    width: "100%",
    borderWidth: 3,
    borderRadius: 10,
    padding: 10,
    borderColor: "#E5E5E5",
    backgroundColor: "#fff",
  },
});
