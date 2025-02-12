import { View, StyleSheet, Text, Image } from "react-native";

/*
  this is the profile section in the settings/accounts tab.

  props - this component takes props for the name, profile picture, and username

 */
export default function Profile(props: any) {
  return (
    <View style={styles.Profile}>
      <View style={styles.ProfileInfo}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Triton King</Text>
        <Text style={{ fontWeight: 500, fontSize: 15, opacity: 0.5 }}>
          @{props.userName}
        </Text>
      </View>
      <View style={styles.profilePic}>
        <Image
          source={props.profilePic ? { uri: props.profilePic } : {}}
          style={styles.profileImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Profile: {
    width: "100%",
    height: 100,
    backgroundColor: "#f5f1e7",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 15,
  },

  ProfileInfo: {
    flexDirection: "column",
    gap: 10,
  },
  Title: {
    fontSize: 20,
    fontWeight: "400",
  },
  profilePic: {
    backgroundColor: "white",
    borderRadius: 50,
    width: 75,
    height: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
});
