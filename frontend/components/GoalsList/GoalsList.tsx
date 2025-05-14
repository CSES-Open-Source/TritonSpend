import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar/SearchBar";
import GoalsRow from "./GoalsRow";

export default function GoalsList(props: any) {
  function formatDate(date: string) {
    const parsedDate = new Date(date);
    const year = parsedDate.getUTCFullYear();
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format it as YYYY-MM-DD
  }
  return (
    <View style={styles.GoalsListContainer}>
      {props.Goals.map(
        (goal: {
          details: string;
          title: string;
          id: number;
          color: string;
          target_date: string;
        }) => {
          return (
            <GoalsRow
              key={goal.id}
              title={goal.title}
              date={formatDate(goal.target_date)}
              content={goal.details}
              deleteGoal={props.deleteGoal}
              editGoal={props.editGoal}
              id={goal.id}
              color={goal.color}
            />
          );
        },
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  GoalsListContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
  },
});
