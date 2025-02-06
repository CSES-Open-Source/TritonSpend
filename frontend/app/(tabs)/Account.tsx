import LogOutButton from "@/components/LogoutButton/LogOutButton";
import Profile from "@/components/Profile/Profile";
import SettingList from "@/components/SettingSection/SettingList";
import { EvilIcons, Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Account() {
  //variables to store values
  //the variables with the word "Text" at the end are temporary values for when the user edits their info
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("TritonKing");
  const [userNameText, setUserNameText] = useState("");
  const [totalBudget, setTotalBudget] = useState("1000");
  const [totalBudgetText, setTotalBudgetText] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profilePicEdit, setProfilePicEdit] = useState("");
  const [Category, setCategory] = useState([
    { id: 1, name: "Food", value: "100", icon: "fast-food-outline" },
    { id: 2, name: "School", value: "100", icon: "school-outline" },
    {
      id: 3,
      name: "Online Games",
      value: "100",
      icon: "game-controller-outline",
    },
  ]);
  const [CategoryText, setCategoryText] = useState([...Category]);

  //to set the default values of the text inputs when user opens modal
  useEffect(() => {
    setUserNameText(userName);
    setTotalBudgetText(totalBudget);
  }, [modalVisible]);
  //function to handle Category Change
  function handleCategoryChange(id: any, value: any) {
    setCategoryText((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, value: value } : category,
      ),
    );
  }
  //saves all data that user wants to edit
  function Save() {
    if (userNameText != "") setUserName(userNameText);
    if (totalBudgetText != "") setTotalBudget(totalBudgetText);
    setCategory(CategoryText);
    setProfilePic(profilePicEdit);
    setModalVisible(false);
  }
  //function for user to choose profile pic
  async function pickImage() {
    // Request permission to access gallery
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    // Open image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    //if not canceled, set profile pic
    if (!result.canceled) {
      setProfilePicEdit(result.assets[0].uri);
    }
  }

  return (
    <>
      {/* Modal(popup) for editing profile */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Edit Settings</Text>
              <EvilIcons
                name="close"
                size={30}
                color="black"
                onPress={() => setModalVisible(false)}
              />
            </View>
            <View style={styles.profileSection}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.profileSection}
              >
                <Image
                  source={profilePicEdit ? { uri: profilePicEdit } : {}}
                  style={styles.profileImage}
                />
                <Text style={styles.editText}>Edit Profile Picture</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputSection}>
              <Text>User Name:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(e) => setUserNameText(e)}
                value={userNameText}
              />
            </View>
            <View style={styles.inputSection}>
              <Text>Total Budget:</Text>
              <TextInput
                style={styles.input}
                onChangeText={(e) => setTotalBudgetText(e)}
                value={totalBudgetText}
              />
            </View>
            <View style={styles.inputSection}>
              <Text>Budget Per Category:</Text>
              {Category.map(
                (section: { name: any; value: any; id: any; icon: any }) => (
                  <View key={section.id} style={{ width: "100%" }}>
                    <Text>{section.name}:</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(e) => handleCategoryChange(section.id, e)}
                    />
                  </View>
                ),
              )}
            </View>

            <Button title="Save" onPress={() => Save()} />
          </View>
        </View>
      </Modal>

      <View style={styles.AccountContainer}>
        <View style={styles.header}>
          <Text style={styles.Title}>Settings</Text>
          <Feather
            name="edit"
            size={25}
            onPress={() => setModalVisible(true)}
          />
        </View>
        <Profile userName={userName} profilePic={profilePic} />
        <SettingList list={Category} totalBudget={totalBudget} />
        <LogOutButton />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  AccountContainer: {
    flex: 1,
    backgroundColor: "#bbadff",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 50,
    flexDirection: "column",
    gap: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "black",
    opacity: 0.2,
    borderRadius: 2,
    marginTop: 10,
  },
  Title: {
    fontWeight: "500",
    fontSize: 30,
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    gap: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
    padding: 15,
  },
  inputTitle: {
    fontWeight: "500",
    fontSize: 20,
  },
  inputSection: {
    gap: 10,
    width: "100%",
    alignItems: "flex-start",
  },
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DBD7D7",
  },
  editText: {
    color: "blue",
    marginTop: 5,
  },
});
