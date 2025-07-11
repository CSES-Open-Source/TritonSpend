import { View, StyleSheet, Text, Image } from "react-native";

/*
  this is the profile section in the settings/accounts tab.

  props - this component takes props for the name, profile picture, and username

 */
export default function Profile(props: any) {
  return (
    <View style={styles.Profile}>
      <View style={styles.ProfileInfo}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {props.userName}
        </Text>
        <Text style={{ fontWeight: 500, fontSize: 15, opacity: 0.5 }}>
          @{props.Email}
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
    backgroundColor: "#E6E6E6",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 15,
    shadowRadius: 12,
    shadowOpacity: 0.4,
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
    backgroundColor: "#E6E6E6",
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
