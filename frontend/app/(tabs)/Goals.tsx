import { useCallback, useMemo, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  ScrollView as RNScrollView,
} from "react-native";
import { ScrollView, YStack } from "tamagui";
import GoalsList from "@/components/GoalsList/GoalsList";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import { PrimaryScreen } from "@/components/primitives/PrimaryScreen";
import { PageHeader } from "@/components/primitives/PageHeader";
import { Card } from "@/components/primitives/Card";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { SearchField } from "@/components/primitives/SearchField";
import { AppButton } from "@/components/primitives/AppButton";
import { AppInput } from "@/components/primitives/AppInput";
import { AppText } from "@/components/primitives/AppText";
import {
  DatePickerField,
  isValidYmd,
  toYmd,
} from "@/components/primitives/DatePickerField";
import { XStack } from "tamagui";
import { sortGoalsByTargetDate } from "@/constants/goalStyles";
import { useAppTheme } from "@/context/themeContext";

interface Goal {
  id: number;
  title: string;
  details: string;
  color?: string;
  target_date: string;
}

export default function Goals() {
  const { userId } = useAuth();
  const { colors } = useAppTheme();
  const [Goals, setGoals] = useState<Goal[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalContent, setNewGoalContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => toYmd(new Date()));

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
        .then((data) => setGoals(sortGoalsByTargetDate(data)))
        .catch((error) => console.error("API Error:", error));
    }, [userId]),
  );

  function addGoal() {
    if (newGoalTitle.trim() && isValidYmd(selectedDate)) {
      const formattedDate = selectedDate;
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
          setGoals(
            sortGoalsByTargetDate([
              ...Goals,
              {
                id: data.id,
                title: newGoalTitle,
                details: newGoalContent,
                color: undefined,
                target_date: formattedDate,
              },
            ]),
          );
          setNewGoalTitle("");
          setNewGoalContent("");
          setSelectedDate(toYmd(new Date()));
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
    if (title.trim() && isValidYmd(target_date)) {
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
            sortGoalsByTargetDate(
              Goals.map((goal) =>
                goal.id === id
                  ? { ...goal, title, details, target_date }
                  : goal,
              ),
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
        text2: "Check the title and pick a valid target date.",
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

  const filteredGoals = useMemo(() => {
    const q = search.toLowerCase();
    return sortGoalsByTargetDate(
      Goals.filter(
        (goal) =>
          goal.title.toLowerCase().includes(q) ||
          goal.details.toLowerCase().includes(q),
      ),
    );
  }, [Goals, search]);

  return (
    <PrimaryScreen>
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

          <AppButton
            onPress={() => {
              setSelectedDate(toYmd(new Date()));
              setModalVisible(true);
            }}
          >
            Add Goal
          </AppButton>

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
          backgroundColor={colors.modalOverlay}
          padding="$4"
        >
          <RNScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            showsVerticalScrollIndicator={false}
          >
            <Card
              width="100%"
              maxWidth={400}
              gap="$4"
              backgroundColor="$surfaceDefault"
              alignSelf="center"
            >
              <AppText variant="title" fontSize="$5" color="$color">
                New Goal
              </AppText>
              <AppInput
                placeholder="Title"
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
              />
              <AppInput
                multiline
                placeholder="Details"
                value={newGoalContent}
                onChangeText={setNewGoalContent}
              />
              <DatePickerField
                compact
                value={selectedDate}
                onChange={setSelectedDate}
                minimumDate={new Date()}
              />
              <XStack justifyContent="flex-end" gap="$3">
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <AppText color="$textMuted">Cancel</AppText>
                </TouchableOpacity>
                <AppButton onPress={addGoal}>Add</AppButton>
              </XStack>
            </Card>
          </RNScrollView>
        </YStack>
      </Modal>
    </PrimaryScreen>
  );
}
