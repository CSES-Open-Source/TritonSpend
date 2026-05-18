import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Pressable, Modal, TouchableOpacity } from "react-native";
import { XStack, YStack } from "tamagui";
import { AppText } from "@/components/primitives/AppText";
import { AppInput } from "@/components/primitives/AppInput";
import { AppButton } from "@/components/primitives/AppButton";
import { Card } from "@/components/primitives/Card";

interface GoalsRowProps {
  id: number;
  title: string;
  date: string;
  content: string;
  color: string;
  editGoal: (id: number, title: string, content: string, date: string) => void;
  deleteGoal: (id: number) => void;
}

export default function GoalsRow({
  id,
  title,
  date,
  content,
  color,
  editGoal,
  deleteGoal,
}: GoalsRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [editDate, setEditDate] = useState(date);
  const expand = useRef(new Animated.Value(70)).current;

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    Animated.spring(expand, {
      toValue: next ? 150 : 70,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }

  return (
    <>
      <Animated.View style={{ height: expand, width: "100%" }}>
        <Card
          backgroundColor={color}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          height="100%"
          padding="$3"
        >
          <Pressable
            onPress={toggle}
            onLongPress={() => setModalVisible(true)}
            style={{ flex: 1, height: "100%", justifyContent: "center" }}
          >
            <AppText variant="subtitle" fontWeight="bold">
              {title}
            </AppText>
            <AppText variant="caption">{date}</AppText>
            {expanded && (
              <AppText variant="body" marginTop="$2">
                {content}
              </AppText>
            )}
          </Pressable>
          <XStack gap="$2" alignItems="center">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              hitSlop={8}
              accessibilityLabel="Edit goal"
            >
              <Ionicons name="create-outline" size={22} color="#395773" />
            </TouchableOpacity>
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#395773"
            />
          </XStack>
        </Card>
      </Animated.View>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <YStack
          flex={1}
          justifyContent="center"
          backgroundColor="rgba(0,0,0,0.5)"
          padding="$4"
        >
          <Card gap="$3" backgroundColor="$surfaceDefault">
            <AppText variant="title" fontSize="$5" color="$color">
              Edit Goal
            </AppText>
            <AppInput
              placeholder="Title"
              value={editTitle}
              onChangeText={setEditTitle}
              placeholderTextColor="#7B8A96"
            />
            <AppInput
              multiline
              placeholder="Details"
              value={editContent}
              onChangeText={setEditContent}
              placeholderTextColor="#7B8A96"
            />
            <AppInput
              placeholder="Target Date (YYYY-MM-DD)"
              value={editDate}
              onChangeText={setEditDate}
              placeholderTextColor="#7B8A96"
            />
            <XStack gap="$2" flexWrap="wrap">
              <AppButton
                flex={1}
                onPress={() => {
                  editGoal(id, editTitle, editContent, editDate);
                  setModalVisible(false);
                }}
              >
                Save
              </AppButton>
              <AppButton
                flex={1}
                variant="outline"
                onPress={() => {
                  deleteGoal(id);
                  setModalVisible(false);
                }}
              >
                Delete
              </AppButton>
              <AppButton
                flex={1}
                variant="outline"
                onPress={() => setModalVisible(false)}
              >
                Cancel
              </AppButton>
            </XStack>
          </Card>
        </YStack>
      </Modal>
    </>
  );
}
