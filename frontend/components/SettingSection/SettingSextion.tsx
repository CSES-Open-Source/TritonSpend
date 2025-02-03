import { View, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";


export default function SettingSection(props: any) {
  return (
    <View style={styles.NewTransaction}>
      <View style={styles.iconAndInfo}>
        {/* place holder for transaction icon */}
        <Feather name={props.icon} size={30} color={"gray"} />
        <View style={{gap:5}}>
          <Text style={{fontWeight:700}}>{props.name}</Text>
          <Text style={{fontWeight:700, opacity:0.4}}>{props.value}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  NewTransaction: {
    width: "100%",
    height: 50,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  iconAndInfo: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
});
