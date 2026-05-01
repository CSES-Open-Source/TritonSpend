import React from "react";
import { Select, SelectProps } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

interface AppSelectProps extends SelectProps {
  options: string[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (newValue: string) => void;
}

export const AppSelect: React.FC<AppSelectProps> = ({
  options,
  value,
  defaultValue,
  onValueChange,
  ...props
}) => {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      {...props}
    >
      <Select.Trigger flex={1}>
        <Select.Value placeholder="Search..." />
      </Select.Trigger>
      <Select.Content>
        <Select.ScrollUpButton />
        <Select.Viewport>
          <Select.Group>
            {React.useMemo(
              () =>
                options.map((item, i) => {
                  return (
                    <Select.Item index={i} key={item} value={item}>
                      <Select.ItemText>{item}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Ionicons name="checkmark-outline" size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [options],
            )}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select>
  );
};
