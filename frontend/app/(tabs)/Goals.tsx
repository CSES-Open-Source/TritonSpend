import { useCallback, useState } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { ScrollView, YStack } from "tamagui";
import GoalsList from "@/components/GoalsList/GoalsList";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import { Screen } from "@/components/primitives/Screen";
import { PageHeader } from "@/components/primitives/PageHeader";
import { Card } from "@/components/primitives/Card";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { SearchField } from "@/components/primitives/SearchField";
import { AppButton } from "@/components/primitives/AppButton";
import { AppInput } from "@/components/primitives/AppInput";
import { AppText } from "@/components/primitives/AppText";
import { XStack } from "tamagui";

interface Goal {
  id: number;
  title: string;
  details: string;
  color: string;
  target_date: string;
}

const colorOptions = [
  "#ffadad",
  "#ffd6a5",
  "#fdffb6",
  "#caffbf",
  "#9bf6ff",
  "#a0c4ff",
  "#bdb2ff",
  "#ffc6ff",
];

export default function Goals() {
  const { userId } = useAuth();
  const [Goals, setGoals] = useState<Goal[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalContent, setNewGoalContent] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetch(`http://localhost:${BACKEND_PORT}/goals/getGoals/${userId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setGoals(data))
        .catch((error) => console.error("API Error:", error));
    }, [userId]),
  );

  function getRandomColor() {
    return colorOptions[Math.floor(Math.random() * colorOptions.length)];
  }

  function isValidDate(date: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  function formatDate(date: string) {
    const parsedDate = new Date(date);
    const year = parsedDate.getUTCFullYear();
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function addGoal() {
    if (newGoalTitle.trim() && isValidDate(selectedDate)) {
      const formattedDate = formatDate(selectedDate);
      fetch(`http://localhost:${BACKEND_PORT}/goals/addGoal`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          title: newGoalTitle,
          details: newGoalContent,
          target_date: formattedDate,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          setGoals([
            ...Goals,
            {
              id: data.id,
              title: newGoalTitle,
              details: newGoalContent,
              color: getRandomColor(),
              target_date: formattedDate,
            },
          ]);
          setNewGoalTitle("");
          setNewGoalContent("");
          setSelectedDate("");
          setModalVisible(false);
          Toast.show({
            type: "success",
            text1: "Goal Added",
            text2: "Your goal has been saved.",
          });
        })
        .catch((error) => console.error("API Error:", error));
    }
  }

  function editGoal(
    id: number,
    title: string,
    details: string,
    target_date: string,
  ) {
    if (title.trim() && isValidDate(target_date)) {
      fetch(`http://localhost:${BACKEND_PORT}/goals/editGoal`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          user_id: userId,
          title,
          details,
          target_date,
        }),
      })
        .then(() => {
          setGoals(
            Goals.map((goal) =>
              goal.id === id ? { ...goal, title, details, target_date } : goal,
            ),
          );
          Toast.show({ type: "success", text1: "Goal Updated" });
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Update Failed",
            text2: "Could not update goal, try again.",
          });
        });
    } else {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Check the title and date format (YYYY-MM-DD).",
      });
    }
  }

  function deleteGoal(id: number) {
    fetch(`http://localhost:${BACKEND_PORT}/goals/deleteGoal`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, user_id: userId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete goal");
        setGoals(Goals.filter((goal) => goal.id !== id));
        Toast.show({ type: "success", text1: "Goal Deleted" });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Deletion Failed",
          text2: "Could not delete goal, try again.",
        });
      });
  }

  const filteredGoals = Goals.filter(
    (goal) =>
      goal.title.toLowerCase().includes(search.toLowerCase()) ||
      goal.details.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Screen backgroundColor="$primary">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack px="$4" py="$4" gap="$4" paddingBottom="$8">
          <PageHeader
            title="Goals"
            subtitle="Track what you're working toward"
          />

          <Card>
            <SectionTitle title="Search" />
            <SearchField
              value={search}
              onChangeText={setSearch}
              placeholder="Search goals…"
            />
          </Card>

          <AppButton onPress={() => setModalVisible(true)}>Add Goal</AppButton>

          <Card>
            <SectionTitle
              title="Your Goals"
              actionText={`${filteredGoals.length}`}
            />
            <GoalsList
              Goals={filteredGoals}
              setGoals={setGoals}
              editGoal={editGoal}
              deleteGoal={deleteGoal}
            />
          </Card>
        </YStack>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor="rgba(0,0,0,0.4)"
          padding="$4"
        >
          <Card width="100%" maxWidth={400} gap="$4">
            <AppText variant="title" fontSize="$5">
              New Goal
            </AppText>
            <AppInput
              placeholder="Title"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
            />
            <AppInput
              placeholder="Details"
              value={newGoalContent}
              onChangeText={setNewGoalContent}
            />
            <AppInput
              placeholder="Target Date (YYYY-MM-DD)"
              value={selectedDate}
              onChangeText={setSelectedDate}
            />
            <XStack justifyContent="flex-end" gap="$3">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AppText color="$textMuted">Cancel</AppText>
              </TouchableOpacity>
              <AppButton onPress={addGoal}>Add</AppButton>
            </XStack>
          </Card>
        </YStack>
      </Modal>
    </Screen>
  );
}
