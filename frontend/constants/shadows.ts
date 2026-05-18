import { ViewStyle } from "react-native";

export const shadows = {
  sm: {
    shadowColor: "#0A2540",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  } satisfies ViewStyle,
  md: {
    shadowColor: "#0A2540",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  } satisfies ViewStyle,
  lg: {
    shadowColor: "#0A2540",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
  } satisfies ViewStyle,
  tabBar: {
    shadowColor: "#0A2540",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,
  } satisfies ViewStyle,
};
