import { useState } from "react";
import { View, StyleSheet, Text, Button,   Modal, TouchableOpacity,} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import SearchBar from "@/components/SearchBar/SearchBar";
import GoalsList from "@/components/GoalsList/GoalsList";
/**
 * Goals page that lists perosnal goals that the user wants
 * Users are able to add, delete, edit their goals
 */
export default function Goals(){
    interface Goal {
        id: number;
        title: string;
        content: string;
        color: string;
    }
    const [Goals, setGoals] = useState<Goal []>([])
    const [search, setSearch] = useState("")
    const [modalVisible, setModalVisible] = useState(false);
    const [newGoalTitle, setNewGoalTitle] = useState("");
    const [newGoalContent, setNewGoalContent] = useState("")
    const [nextId, setNextId] = useState(1);
    const colorOptions = [
        "#ffadad","#ffd6a5","#fdffb6","#caffbf","#9bf6ff","#a0c4ff","#bdb2ff","#ffc6ff","#fffffc"
    ];
    function getRandomColor(){
        const randomIndex = Math.floor(Math.random() * colorOptions.length);
        return colorOptions[randomIndex];
    }
    function addGoal(){
        if (newGoalTitle.trim()) {
          setGoals([...Goals, {id: nextId, title: newGoalTitle, content: newGoalContent, color: getRandomColor()}]);
        setNextId(nextId + 1);
        setNewGoalTitle("");
        setNewGoalContent("");
        setModalVisible(false);
        }
    };
    function editGoal(id:number, title: string, content:string){
        setGoals(Goals.map(goal => goal.id === id? {...goal, title:title, content:content}: goal))
    }
    function deleteGoal(id:number){
        setGoals(Goals.filter((goal => goal.id !== id)))
    }
    const filteredGoals = Goals.filter(goal => {
        return (
            goal.title.toLowerCase().includes(search.toLowerCase()) ||
            goal.content.toLowerCase().includes(search.toLowerCase())
        );
    });

    return(
        <View style={styles.GoalsContainer}>
            <View style={styles.header}>
                <Text style={styles.Title}>Goals</Text>
            </View>
            <SearchBar search = {search} setSearch = {setSearch}/>
            <View style = {styles.addGoalButton}>
                 <Button title="Add Goal" onPress={() => setModalVisible(true)}/>
            </View>
            <ScrollView style={styles.scroll}>
                <GoalsList Goals = {filteredGoals} setGoals = {setGoals} editGoal = {editGoal} deleteGoal = {deleteGoal}/>
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
        width:'100%',
        height:'100%'
    },
    addGoalButton: {
        width:'100%',

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
        padding:10
    },
    addButton: {
        fontSize: 16,
        backgroundColor:'lightgreen',
        padding:10,
        borderRadius:10
    },
});