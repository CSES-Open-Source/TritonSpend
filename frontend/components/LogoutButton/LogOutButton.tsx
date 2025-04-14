import { TouchableOpacity, StyleSheet, Text } from "react-native";

type LogOutButtonProps = {
  onLogout: () => void;
};

export default function LogOutButton({ onLogout }: LogOutButtonProps) {
  return (
    <TouchableOpacity style={styles.ButtonContainer} onPress={onLogout}>
      <Text style={styles.logoutText}>Sign Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ButtonContainer: {
    width: "50%",
    backgroundColor: "#f5f1e7",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  logoutText: {
    color: "black",
    fontWeight: "500",
    fontSize: 20,
  },
});
