import React, { useCallback, useRef, useState, useMemo } from "react";
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { XStack, YStack } from "tamagui";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_PORT } from "@env";
import { Screen } from "@/components/primitives/Screen";
import { Card } from "@/components/primitives/Card";
import { AppText } from "@/components/primitives/AppText";
import { SectionTitle } from "@/components/primitives/SectionTitle";
import { DealCard } from "@/components/Deals/DealCard";

interface Deal {
  id: number;
  name: string;
  description: string;
  category: string;
  url: string;
  badge: string;
  source: string;
  requires_edu: boolean;
  is_ucsd_specific: boolean;
  link_status: string | null;
}

const CATEGORIES = [
  "All", "UCSD", "Software", "Cloud",
  "Entertainment", "Productivity", "Education",
  "Shopping", "AI", "Music",
];

// ── Animated category pill ───────────────────────────────────────────────────
function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, tension: 300, friction: 5 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, tension: 200, friction: 6 }),
    ]).start();
    onPress();
  };

  const isUcsd = label === "UCSD";

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={[
          styles.pill,
          active  && styles.pillActive,
          isUcsd  && !active && styles.pillUcsd,
        ]}
      >
        <AppText style={[
          styles.pillText,
          active  && styles.pillTextActive,
          isUcsd  && !active && styles.pillTextUcsd,
        ]}>
          {isUcsd ? "🔱 UCSD" : label}
        </AppText>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Stat mini-card ───────────────────────────────────────────────────────────
function MiniStat({ value, label, tint }: { value: string; label: string; tint?: string }) {
  return (
    <YStack
      flex={1}
      backgroundColor={tint ?? "$surfaceTintBlue"}
      borderRadius="$4"
      padding="$3"
      alignItems="center"
      gap="$1"
    >
      <AppText variant="title" fontSize="$5" color="$primary">{value}</AppText>
      <AppText variant="caption" color="$textMuted" textAlign="center">{label}</AppText>
    </YStack>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Deals() {
  const [deals, setDeals]             = useState<Deal[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [activeCategory, setCategory] = useState("All");
  const [focused, setFocused]         = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetch(`http://localhost:${BACKEND_PORT}/deals`)
        .then((r) => r.json())
        .then((data) => { setDeals(data); setLoading(false); })
        .catch(() => setLoading(false));
    }, [])
  );

  const onFocus = () => {
    setFocused(true);
    Animated.spring(borderAnim, { toValue: 1, useNativeDriver: false, tension: 100, friction: 8 }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.spring(borderAnim, { toValue: 0, useNativeDriver: false, tension: 100, friction: 8 }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#C6C6C8", "#395773"],
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return deals.filter((d) => {
      const matchCat    = activeCategory === "All" || d.category === activeCategory;
      const matchSearch = !q || d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.badge.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [deals, activeCategory, search]);

  const freeCount = deals.filter((d) => d.badge === "Free").length;
  const ucsdCount = deals.filter((d) => d.is_ucsd_specific).length;

  // ── List header (everything above the cards) ──
  const ListHeader = (
    <YStack px="$4" pt="$4" gap="$4" pb="$2">
      {/* Page title */}
      <YStack gap="$1">
        <AppText variant="title" fontSize="$7" color="white">
          Deals & Offers
        </AppText>
        <AppText fontSize="$3" color="white" opacity={0.7}>
          Exclusive savings for UCSD students
        </AppText>
      </YStack>

      {/* Stats row */}
      <XStack gap="$3">
        <MiniStat value={`${deals.length}`}  label="Total Deals" />
        <MiniStat value={`${freeCount}`}      label="Free" tint="$surfaceTintGreen" />
        <MiniStat value={`🔱 ${ucsdCount}`}   label="UCSD Only" tint="$surfaceTintYellow" />
      </XStack>

      {/* Search inside a Card */}
      <Card>
        <SectionTitle title="Search" />
        <Animated.View style={[styles.searchRow, { borderColor }]}>
          <Ionicons name="search" size={17} color={focused ? "#395773" : "#7B8A96"} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search deals, apps, discounts…"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            onFocus={onFocus}
            onBlur={onBlur}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={17} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </Card>

      {/* Category pills inside a Card */}
      <Card>
        <SectionTitle title="Categories" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          <XStack gap="$2" paddingBottom="$1">
            {CATEGORIES.map((cat) => (
              <Pill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onPress={() => setCategory(cat)}
              />
            ))}
          </XStack>
        </ScrollView>
      </Card>

      {/* Results label */}
      {!loading && (
        <AppText fontSize="$2" color="white" opacity={0.75} fontWeight="600">
          {filtered.length} deal{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? `  ·  ${activeCategory}` : ""}
          {search ? `  ·  "${search}"` : ""}
        </AppText>
      )}
    </YStack>
  );

  return (
    <Screen backgroundColor="$primary">
      {loading ? (
        <>
          {ListHeader}
          <YStack flex={1} alignItems="center" justifyContent="center" gap="$3">
            <ActivityIndicator size="large" color="white" />
            <AppText color="white" opacity={0.7}>Loading deals…</AppText>
          </YStack>
        </>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.cardWrap}>
              <DealCard {...item} index={index} />
            </View>
          )}
          ListHeaderComponent={ListHeader}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <YStack alignItems="center" paddingTop={48} gap="$3" px="$4">
              <AppText style={{ fontSize: 48 }}>🎟️</AppText>
              <AppText color="white" textAlign="center" opacity={0.8}>
                No deals found.{"\n"}Try a different search or category.
              </AppText>
            </YStack>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F7F9FA",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1C252E",
    paddingVertical: 0,
  },

  // Pills
  pillsScroll: { marginHorizontal: -4 },
  pill: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillActive:      { backgroundColor: "#395773" },
  pillUcsd:        { backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FCD34D" },
  pillText:        { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  pillTextActive:  { color: "#FFFFFF" },
  pillTextUcsd:    { color: "#92400E" },

  // List
  cardWrap:    { paddingHorizontal: 16 },
  listContent: { paddingBottom: 40 },
});
