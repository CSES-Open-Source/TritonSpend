import { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import SearchBar from "@/components/SearchBar/SearchBar";
import GoalsList from "@/components/GoalsList/GoalsList";
import { BACKEND_PORT } from "@env";
import { useAuth } from "@/context/authContext";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
/**
 * Goals page that lists perosnal goals that the user wants
 * Users are able to add, delete, edit their goals
 */
export default function Goals() {
  interface Goal {
    id: number;
    title: string;
    details: string;
    color: string;
    target_date: string;
  }
  const { userId } = useAuth();
  const [Goals, setGoals] = useState<Goal[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalContent, setNewGoalContent] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const colorOptions = [
    "#ffadad",
    "#ffd6a5",
    "#fdffb6",
    "#caffbf",
    "#9bf6ff",
    "#a0c4ff",
    "#bdb2ff",
    "#ffc6ff",
    "#fffffc",
  ];
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
        .then((data) => {
          setGoals(data);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }, []),
  );
  function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * colorOptions.length);
    return colorOptions[randomIndex];
  }
  function isValidDate(date: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // format for YYYY-MM-DD
    return regex.test(date);
  }
  function formatDate(date: string) {
    const parsedDate = new Date(date);
    const year = parsedDate.getUTCFullYear();
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format it as YYYY-MM-DD
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
          // setNextId(nextId + 1);
          setNewGoalTitle("");
          setNewGoalContent("");
          setSelectedDate("");
          setModalVisible(false);
          Toast.show({
            type: "success",
            text1: "Goal Added ✅",
            text2: "Your transaction has been recorded",
          });
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
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
          details: details,
          target_date: target_date,
        }),
      })
        .then((res) => {
          setGoals(
            Goals.map((goal) =>
              goal.id === id
                ? {
                    ...goal,
                    title: title,
                    details: details,
                    target_date: target_date,
                  }
                : goal,
            ),
          );
          Toast.show({
            type: "success",
            text1: "Goal Updated ✅",
          });
        })
        .catch((error) => {
          console.error("Edit Goal Error:", error);
          Toast.show({
            type: "error",
            text1: "Update Failed ❌",
            text2: "Could not update goal, try again.",
          });
        });
    } else {
      Toast.show({
        type: "error",
        text1: "Update Failed ❌",
        text2: "Could not update goal, try again.",
      });
    }
  }
  function deleteGoal(id: number) {
    // setGoals(Goals.filter((goal) => goal.id !== id));
    fetch(`http://localhost:${BACKEND_PORT}/goals/deleteGoal`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        user_id: userId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete goal");
        }
        setGoals(Goals.filter((goal) => goal.id !== id));
        Toast.show({
          type: "success",
          text1: "Goal Deleted ✅",
        });
      })
      .catch((error) => {
        console.error("Delete Goal Error:", error);
        Toast.show({
          type: "error",
          text1: "Deletion Failed ❌",
          text2: "Could not delete goal, try again.",
        });
      });
  }
  const filteredGoals = Goals.filter((goal) => {
    return (
      goal.title.toLowerCase().includes(search.toLowerCase()) ||
      goal.details.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <View style={styles.GoalsContainer}>
      <View style={styles.header}>
        <Text style={styles.Title}>Goals</Text>
      </View>
      <SearchBar search={search} setSearch={setSearch} />
      <View style={styles.addGoalButton}>
        <Button title="Add Goal" onPress={() => setModalVisible(true)} />
      </View>
      <ScrollView style={styles.scroll}>
        <GoalsList
          Goals={filteredGoals}
          setGoals={setGoals}
          editGoal={editGoal}
          deleteGoal={deleteGoal}
        />
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter New Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Details"
              value={newGoalContent}
              onChangeText={setNewGoalContent}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Target Date (YYYY-MM-DD)"
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholderTextColor="#888"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addGoal}>
                <Text style={styles.addButton}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  GoalsContainer: {
    flex: 1,
    backgroundColor: "rgb(200,200,250)",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 50,
    flexDirection: "column",
    gap: 30,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: 50,
  },
  Title: {
    fontWeight: "500",
    fontSize: 30,
    width: "100%",
  },
  scroll: {
    width: "100%",
    height: "100%",
  },
  addGoalButton: {
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
    gap: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  cancelButton: {
    fontSize: 16,
    padding: 10,
  },
  addButton: {
    fontSize: 16,
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 10,
  },
});
