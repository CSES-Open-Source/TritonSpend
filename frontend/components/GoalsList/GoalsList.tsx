import { useState } from "react";
import { View, StyleSheet, Text} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar/SearchBar";
import GoalsRow from "./GoalsRow";

export default function GoalsList(props:any){
    return(
        <View style={styles.GoalsListContainer}>
            {props.Goals.map((goal: { title: string; content: string; id:Number; color: string; }) => {
                return (
                    <GoalsRow 
                    key = {goal.id} 
                    title = {goal.title} 
                    date = "1/1/1" 
                    content = {goal.content} 
                    deleteGoal = {props.deleteGoal} 
                    editGoal = {props.editGoal}
                    id = {goal.id}
                    color = {goal.color}
                    />
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    GoalsListContainer: {
        width:'100%',
        height:'100%',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        gap:10
    }
});