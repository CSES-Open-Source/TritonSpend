import React, { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { XStack } from "tamagui";
import { shadows } from "@/constants/shadows";
import { useAppTheme } from "@/context/themeContext";

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
  const [focused, setFocused] = useState(false);
  const { colors } = useAppTheme();

  return (
    <XStack
      alignItems="center"
      gap="$2"
      backgroundColor={colors.searchBg}
      borderRadius="$4"
      borderWidth={1.5}
      borderColor={focused ? colors.searchBorderFocused : colors.searchBorder}
      paddingHorizontal="$3"
      paddingVertical="$2"
      style={focused ? shadows.sm : undefined}
    >
      <Ionicons
        name="search"
        size={17}
        color={focused ? colors.searchIconFocused : colors.searchIcon}
      />
      <TextInput
        style={{
          flex: 1,
          fontSize: 14,
          color: colors.searchText,
          paddingVertical: 4,
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.searchPlaceholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => (onClear ? onClear() : onChangeText(""))}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="close-circle"
            size={17}
            color={colors.searchPlaceholder}
          />
        </TouchableOpacity>
      )}
    </XStack>
  );
};
