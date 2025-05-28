import {
  View,
  StyleSheet,
  Text,
  Animated,
  Pressable,
  TextInput,
  Button,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";

//button that expands and shows a text input for recent transactions
export default function NewTransactionButton(props: any) {
  //usestate for expanding button, if true, button is expanded, initially set to false
  const [inputVisible, setInputVisible] = useState(false);
  //refs for animation(X icon rotating, button expanding... etc)
  const rotation = useRef(new Animated.Value(0)).current;
  const inputShow = useRef(new Animated.Value(-20)).current;
  const expand = useRef(new Animated.Value(50)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const { userId } = useAuth();
  //rotation iterpolate for X icon
  const interpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  //for the selected category and the transaction amount
  const [selectedCategory, setSelectedCategory] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [itemInformation, setItemInformation] = useState("");
  //toggle function for buttion, starts all animation when toggled and sets inputVisible accordingly
  function toggle() {
    setInputVisible(!inputVisible);
    Animated.spring(rotation, {
      toValue: inputVisible ? 0 : 1,
      tension: 100,
      useNativeDriver: true,
    }).start();
    Animated.spring(expand, {
      toValue: inputVisible ? 50 : 260,
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
  function addTransaction() {
    fetch(`http://localhost:${BACKEND_PORT}/transactions/newTransaction`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        item_name: itemInformation,
        amount: Number(transactionAmount),
        category_name: selectedCategory,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            Toast.show({
              type: "error",
              text1: "Transaction Unsuccessful ❌",
              text2: "One or more fields are invalid, try again",
            });

            throw new Error(err.error || "Something went wrong");
          });
        }
        props.setUpdateRecent(!props.updateRecent);
        setItemInformation("");
        setTransactionAmount("");
        setSelectedCategory("");
        Toast.show({
          type: "success",
          text1: "Transaction Successful ✅",
          text2: "Your transaction has been recorded",
        });

        return res.json();
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }
  return (
    <Animated.View style={[styles.newTransaction, { height: expand }]}>
      <Pressable onPress={toggle}>
        <View style={[styles.button]}>
          <Text style={styles.Title}>New Transaction</Text>
          <Animated.View style={{ transform: [{ rotate: interpolate }] }}>
            <MaterialIcons name="add-circle-outline" size={32} />
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
            {/* <<<<<<< HEAD
            <Picker.Item label="Food" value="6" />
            <Picker.Item label="Shopping" value="7" />
            <Picker.Item label="Transportation" value="8" />
            <Picker.Item label="Subsciptions" value="9" />
            <Picker.Item label="Other" value="10" />
======= */}
            <Picker.Item label="Food" value="Food" />
            <Picker.Item label="Shopping" value="Shopping" />
            <Picker.Item label="Transportation" value="Transportation" />
            <Picker.Item label="Subscriptions" value="Subscriptions" />
            <Picker.Item label="Other" value="Other" />
            {/* >>>>>>> main */}
          </Picker>

          <TextInput
            style={styles.textInput}
            placeholder="Item Information"
            onChangeText={(e) => setItemInformation(e)}
            value={itemInformation}
          />

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
          <Button title="Save Transaction" onPress={addTransaction} />
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  newTransaction: {
    backgroundColor: "#E6E6E6",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 10,
    cursor: "pointer",
    width: "100%",
    shadowRadius: 12,
    shadowOpacity: 0.4,
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
    fontSize: 20,
  },
  inputContainer: {
    width: "90%",
    gap: 10,
  },
  textInput: {
    width: "100%",
    borderWidth: 3,
    borderRadius: 10,
    padding: 10,
    borderColor: "#E5E5E5",
    backgroundColor: "#fff",
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
