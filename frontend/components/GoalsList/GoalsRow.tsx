import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Pressable,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
export default function GoalsRow(props: any) {
  const [inputVisible, setInputVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState(props.title);
  const [editContent, setEditContent] = useState(props.content);
  const [editDate, setEditDate] = useState(props.date);
  const expand = useRef(new Animated.Value(70)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const inputShow = useRef(new Animated.Value(-20)).current;
  function toggle() {
    setInputVisible(!inputVisible);
    Animated.spring(expand, {
      toValue: inputVisible ? 70 : 150,
      tension: 40,
      useNativeDriver: false,
    }).start();
    Animated.timing(inputShow, {
      toValue: inputVisible ? -20 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(animatedOpacity, {
      toValue: inputVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }
  return (
    <>
      <Animated.View
        style={[
          styles.GoalsContainer,
          { height: expand, backgroundColor: props.color },
        ]}
      >
        <Pressable
          onPress={toggle}
          onLongPress={() => setModalVisible(true)}
          style={{ height: "100%", width: "80%" }}
        >
          <Text style={styles.title}>{props.title}</Text>
          <Text>{props.date}</Text>
          {inputVisible ? (
            <Animated.View
              style={[
                styles.content,
                {
                  transform: [{ translateY: inputShow }],
                  opacity: animatedOpacity,
                },
              ]}
            >
              <Text>{props.content}</Text>
            </Animated.View>
          ) : null}
        </Pressable>
        <Ionicons name="checkmark-circle-outline" size={25} />
      </Animated.View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Content"
              multiline
              value={editContent}
              onChangeText={setEditContent}
            />
            <TextInput
              style={styles.input}
              placeholder="Target Date (YYYY-MM-DD)"
              value={editDate}
              onChangeText={setEditDate}
              placeholderTextColor="#888"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  props.editGoal(props.id, editTitle, editContent, editDate);
                  setModalVisible(false);
                }}
                style={styles.modalButton}
              >
                <Text>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.deleteGoal(props.id);
                  setModalVisible(false);
                }}
                style={[styles.modalButton, { backgroundColor: "#f99" }]}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  GoalsContainer: {
    width: "100%",
    height: 70,
    backgroundColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    cursor: "pointer",
  },
  title: {
    fontSize: 20,
  },
  content: {
    display: "flex",
    height: "60%",
    width: "100%",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    margin: 30,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#E6E6E6",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    minWidth: 70,
    alignItems: "center",
  },
});
