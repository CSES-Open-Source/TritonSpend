import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { XStack, YStack } from "tamagui";
import { AppText } from "@/components/primitives/AppText";
import { AppInput } from "@/components/primitives/AppInput";
import { AppButton } from "@/components/primitives/AppButton";
import { Card } from "@/components/primitives/Card";
import { DatePickerField } from "@/components/primitives/DatePickerField";
import { useAppTheme } from "@/context/themeContext";

interface GoalsRowProps {
  id: number;
  title: string;
  date: string;
  content: string;
  editGoal: (id: number, title: string, content: string, date: string) => void;
  deleteGoal: (id: number) => void;
}

export default function GoalsRow({
  id,
  title,
  date,
  content,
  editGoal,
  deleteGoal,
}: GoalsRowProps) {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [editDate, setEditDate] = useState(date);
  const expand = useRef(new Animated.Value(70)).current;

  useEffect(() => {
    if (modalVisible) {
      setEditTitle(title);
      setEditContent(content);
      setEditDate(date);
    }
  }, [modalVisible, title, content, date]);

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
          backgroundColor="$surfaceTintBlue"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          height="100%"
          padding="$3"
          borderRadius="$4"
          marginBottom="$2"
        >
          <Pressable
            onPress={toggle}
            onLongPress={() => setModalVisible(true)}
            style={{ flex: 1, height: "100%", justifyContent: "center" }}
          >
            <AppText variant="subtitle" fontWeight="bold" color="$color">
              {title}
            </AppText>
            <AppText variant="caption" color="$textMuted">
              {date}
            </AppText>
            {expanded && (
              <AppText variant="body" marginTop="$2" color="$color">
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
              <Ionicons name="create-outline" size={22} color="$color" />
            </TouchableOpacity>
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="$color"
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
          backgroundColor={colors.modalOverlay}
          padding="$4"
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            showsVerticalScrollIndicator={false}
          >
            <Card
              gap="$3"
              backgroundColor="$surfaceDefault"
              width="100%"
              maxWidth={400}
              alignSelf="center"
            >
              <AppText variant="title" fontSize="$5" color="$color">
                Edit Goal
              </AppText>
              <AppInput
                placeholder="Title"
                value={editTitle}
                onChangeText={setEditTitle}
              />
              <AppInput
                multiline
                placeholder="Details"
                value={editContent}
                onChangeText={setEditContent}
              />
              <DatePickerField
                compact
                value={editDate}
                onChange={setEditDate}
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
          </ScrollView>
        </YStack>
      </Modal>
    </>
  );
}
