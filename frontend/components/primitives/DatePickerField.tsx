import React, { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack } from "tamagui";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";

export function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseYmd(ymd: string): Date {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    return new Date();
  }
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isValidYmd(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function formatDisplay(ymd: string): string {
  if (!ymd || !isValidYmd(ymd)) return "Select target date";
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface DatePickerFieldProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  /** Always show the calendar (best inside modals). */
  inline?: boolean;
  minimumDate?: Date;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  label = "Target Date",
  inline = false,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = useState(inline);
  const pickerDate = parseYmd(value);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android" && !inline) {
      setShowPicker(false);
    }
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    if (selected) {
      onChange(toYmd(selected));
    }
  };

  if (Platform.OS === "web") {
    return (
      <YStack gap="$2">
        <AppText variant="caption" color="$textMuted">
          {label}
        </AppText>
        {/* @ts-expect-error web-only input */}
        <input
          type="date"
          value={value || ""}
          min={minimumDate ? toYmd(minimumDate) : undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            borderRadius: 12,
            border: "1px solid #C6C6C8",
            backgroundColor: "#FFFFFF",
            color: "#1C252E",
            fontFamily: "Inter, Helvetica, Arial, sans-serif",
          }}
        />
      </YStack>
    );
  }

  const pickerDisplay = Platform.OS === "ios" ? "inline" : "calendar";

  return (
    <YStack gap="$2">
      <AppText variant="caption" color="$textMuted">
        {label}
      </AppText>

      {!inline && (
        <TouchableOpacity onPress={() => setShowPicker((v) => !v)}>
          <XStack
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="$surfaceDefault"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
            paddingHorizontal="$3"
            paddingVertical="$3"
          >
            <AppText color={value ? "$color" : "$textMuted"} flex={1}>
              {formatDisplay(value)}
            </AppText>
            <Ionicons name="calendar-outline" size={20} color="#395773" />
          </XStack>
        </TouchableOpacity>
      )}

      {inline && (
        <AppText variant="body" fontWeight="600" color="$primary">
          {formatDisplay(value)}
        </AppText>
      )}

      {(inline || showPicker) && (
        <YStack
          backgroundColor="$surfaceDefault"
          borderRadius="$3"
          borderWidth={1}
          borderColor="$borderColor"
          overflow="hidden"
          alignItems="center"
        >
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display={pickerDisplay}
            onChange={handleChange}
            minimumDate={minimumDate}
            themeVariant="light"
          />
          {Platform.OS === "ios" && !inline && (
            <AppButton
              width="100%"
              borderRadius={0}
              onPress={() => setShowPicker(false)}
            >
              Done
            </AppButton>
          )}
        </YStack>
      )}
    </YStack>
  );
};
