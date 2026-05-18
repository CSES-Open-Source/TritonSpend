import LogOutButton from "@/components/LogoutButton/LogOutButton";
import Profile from "@/components/Profile/Profile";
import SettingList from "@/components/SettingSection/SettingList";
import { Feather, EvilIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  Image,
  ScrollView as RNScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import { PrimaryScreen } from "@/components/primitives/PrimaryScreen";
import { PageHeader } from "@/components/primitives/PageHeader";
import { Card } from "@/components/primitives/Card";
import { AppInput } from "@/components/primitives/AppInput";
import { AppButton } from "@/components/primitives/AppButton";
import { AppText } from "@/components/primitives/AppText";
import { YStack, ScrollView, XStack } from "tamagui";
import ThemeToggle from "@/components/SettingSection/ThemeToggle";
import { useAppTheme } from "@/context/themeContext";

interface CategoryBudget {
  category_name: string;
  max_category_budget: string;
  id: number;
}

export default function Account() {
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [Email, setEmail] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [Category, setCategory] = useState<CategoryBudget[]>([]);
  const { userId } = useAuth();
  const { colors } = useAppTheme();

  useEffect(() => {
    fetch(`http://localhost:${BACKEND_PORT}/users/${userId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setUserName(data.username);
        setEmail(data.email);
        setTotalBudget(data.total_budget);
        setProfilePic(data.profile_picture);
      })
      .catch((error) => console.error("API Error:", error));

    fetch(`http://localhost:${BACKEND_PORT}/users/category/${userId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setCategory(data))
      .catch((error) => console.error("API Error:", error));
  }, [modalVisible, userId]);

  function handleCategoryChange(id: number, value: string) {
    setCategory((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, max_category_budget: value }
          : category,
      ),
    );
  }

  function Save() {
    setModalVisible(false);
    const formData = new FormData();
    formData.append("username", userName);
    formData.append("profile_picture", profilePic);
    formData.append("total_budget", totalBudget);
    formData.append("categories", JSON.stringify(Category));
    if (userId) {
      formData.append("id", userId);
    }

    fetch(`http://localhost:${BACKEND_PORT}/users/updateSettings`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            Toast.show({
              type: "error",
              text1: "Update Failed",
              text2: "One or more fields are invalid, try again",
            });
            throw new Error(err.error || "Something went wrong");
          });
        }
        Toast.show({
          type: "success",
          text1: "Account Updated",
          text2: "Your account information has been updated.",
        });
        return res.json();
      })
      .catch((error) => console.error("API Error:", error));
  }

  async function pickImage() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  }

  return (
    <>
      <Modal animationType="slide" visible={modalVisible}>
        <YStack flex={1} backgroundColor="$background">
          <XStack
            paddingHorizontal="$4"
            paddingVertical="$3"
            justifyContent="space-between"
            alignItems="center"
            backgroundColor="$surfaceDefault"
            borderBottomWidth={1}
            borderColor="$border"
          >
            <AppText variant="title" fontSize="$5">
              Edit Settings
            </AppText>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <EvilIcons name="close" size={30} color="#395773" />
            </TouchableOpacity>
          </XStack>
          <RNScrollView>
            <YStack padding="$4" gap="$4">
              <Card alignItems="center" gap="$3">
                <TouchableOpacity onPress={pickImage}>
                  <Image
                    source={profilePic ? { uri: profilePic } : {}}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: "#DBD7D7",
                    }}
                  />
                  <AppText color="$primary" marginTop="$2">
                    Edit Profile Picture
                  </AppText>
                </TouchableOpacity>
              </Card>

              <Card gap="$3">
                <AppText variant="subtitle">User Name</AppText>
                <AppInput value={userName} onChangeText={setUserName} />
              </Card>

              <Card gap="$3">
                <AppText variant="subtitle">Total Budget</AppText>
                <AppInput
                  value={totalBudget}
                  onChangeText={(e) => {
                    if (/^\d*\.?\d*$/.test(e)) setTotalBudget(e);
                  }}
                  keyboardType="numeric"
                />
              </Card>

              <Card gap="$3">
                <AppText variant="subtitle">Budget Per Category</AppText>
                {Category.map((section) => (
                  <YStack key={section.id} gap="$2">
                    <AppText variant="caption">{section.category_name}</AppText>
                    <AppInput
                      defaultValue={String(section.max_category_budget)}
                      onChangeText={(e) => handleCategoryChange(section.id, e)}
                      keyboardType="numeric"
                    />
                  </YStack>
                ))}
              </Card>

              <AppButton onPress={Save}>Save</AppButton>
            </YStack>
          </RNScrollView>
        </YStack>
      </Modal>

      <PrimaryScreen>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack px="$4" py="$4" gap="$4" paddingBottom="$8">
            <PageHeader
              title="Settings"
              subtitle="Manage your account and budgets"
              action={
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Feather name="edit" size={22} color={colors.onPrimary} />
                </TouchableOpacity>
              }
            />
            <Profile
              userName={userName}
              profilePic={profilePic}
              Email={Email}
            />
            <ThemeToggle />
            <SettingList
              list={Category.map((c) => ({
                ...c,
                max_category_budget: parseFloat(String(c.max_category_budget)),
              }))}
              totalBudget={totalBudget}
            />
            <LogOutButton />
          </YStack>
        </ScrollView>
      </PrimaryScreen>
    </>
  );
}
