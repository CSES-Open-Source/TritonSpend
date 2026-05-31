import { Animated, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { BACKEND_URL } from "@env";
import { useAuth } from "@/context/authContext";
import { XStack } from "tamagui";
import { AppText } from "@/components/primitives/AppText";
import { AppInput } from "@/components/primitives/AppInput";
import { AppButton } from "@/components/primitives/AppButton";
import { useAppTheme } from "@/context/themeContext";

interface NewTransactionButtonProps {
  setUpdateRecent: (_val: boolean) => void; // eslint-disable-line no-unused-vars
  updateRecent: boolean;
  forceOpen?: boolean;
  onForceOpenHandled?: () => void;
}

export default function NewTransactionButton({
  setUpdateRecent,
  updateRecent,
  forceOpen,
  onForceOpenHandled,
}: NewTransactionButtonProps) {
  const [inputVisible, setInputVisible] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const inputShow = useRef(new Animated.Value(-20)).current;
  const expand = useRef(new Animated.Value(50)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const { userId } = useAuth();
  const { colors } = useAppTheme();

  const interpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [itemInformation, setItemInformation] = useState("");
  const [paymentSource, setPaymentSource] = useState<
    "DINING_DOLLARS" | "TRITON_CASH" | "CARD"
  >("CARD");

  function toggle(forceExpand?: boolean) {
    const shouldOpen = forceExpand !== undefined ? forceExpand : !inputVisible;
    if (shouldOpen === inputVisible) return;
    setInputVisible(shouldOpen);
    Animated.spring(rotation, {
      toValue: shouldOpen ? 1 : 0,
      tension: 100,
      useNativeDriver: true,
    }).start();
    Animated.spring(expand, {
      toValue: shouldOpen ? 260 : 50,
      tension: 40,
      useNativeDriver: false,
    }).start();
    Animated.timing(inputShow, {
      toValue: shouldOpen ? 0 : -20,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(animatedOpacity, {
      toValue: shouldOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (forceOpen) {
      toggle(true);
      onForceOpenHandled?.();
    }
  }, [forceOpen]);

  function addTransaction() {
    fetch(`${BACKEND_URL}/transactions/newTransaction`, {
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
        payment_source: paymentSource,
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
        setUpdateRecent(!updateRecent);
        setItemInformation("");
        setTransactionAmount("");
        setSelectedCategory("");
        setPaymentSource("CARD");
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
    <Animated.View
      style={{
        backgroundColor: colors.searchBg,
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 10,
        width: "100%",
        borderWidth: 1,
        borderColor: colors.searchBorder,
        shadowRadius: 12,
        shadowOpacity: 0.4,
        height: expand,
      }}
    >
      <Pressable onPress={() => toggle()} style={{ width: "100%" }}>
        <XStack
          width="100%"
          height={50}
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$3"
          gap="$5"
        >
          <AppText variant="title" fontSize="$5" color={colors.searchText}>
            New Transaction
          </AppText>
          <Animated.View style={{ transform: [{ rotate: interpolate }] }}>
            <MaterialIcons
              name="add-circle-outline"
              size={32}
              color={colors.searchText}
            />
          </Animated.View>
        </XStack>
      </Pressable>
      {inputVisible ? (
        <Animated.View
          style={{
            width: "90%",
            gap: 10,
            transform: [{ translateY: inputShow }],
            opacity: animatedOpacity,
          }}
        >
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            dropdownIconColor={colors.searchText}
            style={{
              width: "100%",
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              borderColor: colors.searchBorder,
              backgroundColor: colors.searchBg,
              color: colors.searchText,
            }}
            itemStyle={{
              color: colors.searchText,
            }}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Food" value="Food" />
            <Picker.Item label="Shopping" value="Shopping" />
            <Picker.Item label="Transportation" value="Transportation" />
            <Picker.Item label="Subscriptions" value="Subscriptions" />
            <Picker.Item label="Other" value="Other" />
          </Picker>

          <Picker
            selectedValue={paymentSource}
            onValueChange={(itemValue) => setPaymentSource(itemValue)}
            dropdownIconColor={colors.searchText}
            style={{
              width: "100%",
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              borderColor: colors.searchBorder,
              backgroundColor: colors.searchBg,
              color: colors.searchText,
            }}
            itemStyle={{
              color: colors.searchText,
            }}
          >
            <Picker.Item label="Payment: Cash/Credit/Debit" value="CARD" />
            <Picker.Item
              label="Payment: Dining Dollars"
              value="DINING_DOLLARS"
            />
            <Picker.Item label="Payment: Triton Cash" value="TRITON_CASH" />
          </Picker>

          <AppInput
            placeholder="Item Information"
            onChangeText={(e) => setItemInformation(e)}
            value={itemInformation}
          />

          <AppInput
            placeholder="Transaction Amount"
            keyboardType="numeric"
            value={transactionAmount}
            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text)) {
                setTransactionAmount(text);
              }
            }}
          />

          <AppButton onPress={addTransaction}>Save Transaction</AppButton>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
