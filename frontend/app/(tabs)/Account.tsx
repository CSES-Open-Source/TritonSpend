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
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
export default function Account() {
  //variables to store values
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [Category, setCategory] = useState<any>([]);

  //fetch values
  useEffect(() => {
    fetch("http://localhost:5000/getUser/1", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserName(data.username);
        setEmail(data.email);
        setTotalBudget(data.total_budget);
        setProfilePic(data.profile_picture);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });

    fetch("http://localhost:5000/getCategoryForUser/1", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategory(data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, [modalVisible]);
  //function to handle Category Change
  function handleCategoryChange(id: number, value: string) {
    setCategory((prev: any) =>
      prev.map((category: any) =>
        category.id === id
          ? { ...category, max_category_budget: value }
          : category,
      ),
    );
  }
  //saves all data that user wants to edit
  function Save() {
    setModalVisible(false);
    const formData = new FormData();
    formData.append("username", userName);
    formData.append("profile_picture", profilePic);
    formData.append("total_budget", totalBudget);
    formData.append("categories", JSON.stringify(Category));
    formData.append("id", "1");
    fetch("http://localhost:5000/updateSettings", {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            Toast.show({
              type: "error",
              text1: "Transaction Unsuccessful ❌",
              text2: "One or more fields are invalid, try again",
            });

            throw new Error(err.error || "Something went wrong");
          });
        }
        Toast.show({
          type: "success",
          text1: "Account Info Updated ✅",
          text2: "Your account information has been updated!",
        });
        return res.json();
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
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
      setProfilePic(result.assets[0].uri);
    }
  }

  return (
    <>
      {/* Modal(popup) for editing profile */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Edit Settings</Text>
          <EvilIcons
            name="close"
            size={30}
            color="black"
            onPress={() => setModalVisible(false)}
          />
        </View>
        <ScrollView>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.profileSection}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.profileSection}
                >
                  <Image
                    source={profilePic ? { uri: profilePic } : {}}
                    style={styles.profileImage}
                  />
                  <Text style={styles.editText}>Edit Profile Picture</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputSection}>
                <Text>User Name:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(e) => setUserName(e)}
                  value={userName}
                />
              </View>
              <View style={styles.inputSection}>
                <Text>Total Budget:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(e) => {
                    if (/^\d*\.?\d*$/.test(e)) {
                      setTotalBudget(e);
                    }
                  }}
                  value={totalBudget}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputSection}>
                <Text>Budget Per Category:</Text>
                {Category.map(
                  (section: {
                    category_name: string;
                    max_category_budget: string;
                    id: number;
                    icon: string;
                  }) => (
                    <View key={section.id} style={{ width: "100%" }}>
                      <Text>{section.category_name}:</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(e) =>
                          handleCategoryChange(section.id, e)
                        }
                        keyboardType="numeric"
                      />
                    </View>
                  ),
                )}
              </View>

              <Button title="Save" onPress={() => Save()} />
            </View>
          </View>
        </ScrollView>
      </Modal>
      <ScrollView>
        <View style={styles.AccountContainer}>
          <View style={styles.header}>
            <Text style={styles.Title}>Settings</Text>
            <Feather
              name="edit"
              size={25}
              onPress={() => setModalVisible(true)}
            />
          </View>
          <Profile userName={userName} profilePic={profilePic} Email={Email} />
          <SettingList list={Category} totalBudget={totalBudget} />
          <LogOutButton />
        </View>
      </ScrollView>
      <Toast />
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
    height: 50,
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
    fontSize: 17,
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
