import React from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { XStack } from "tamagui";

interface SearchFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChangeText,
  placeholder = "Search…",
  onClear,
}) => {
  return (
    <XStack
      alignItems="center"
      gap="$2"
      backgroundColor="#F7F9FA"
      borderRadius="$3"
      borderWidth={1.5}
      borderColor="$border"
      paddingHorizontal="$3"
      paddingVertical="$2"
    >
      <Ionicons name="search" size={17} color="#7B8A96" />
      <TextInput
        style={{ flex: 1, fontSize: 14, color: "#1C252E", paddingVertical: 4 }}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => (onClear ? onClear() : onChangeText(""))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={17} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </XStack>
  );
};
