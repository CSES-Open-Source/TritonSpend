import React, { useEffect, useRef } from "react";
import { Animated, Linking, StyleSheet, TouchableOpacity } from "react-native";
import { XStack, YStack, Card } from "tamagui";
import { AppText } from "@/components/primitives/AppText";

interface DealCardProps {
  name: string;
  description: string;
  category: string;
  url: string;
  badge: string;
  requires_edu: boolean;
  is_ucsd_specific: boolean;
  link_status: string | null;
  index: number;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  Software:      { bg: "#EFF6FF", text: "#1D4ED8" },
  Cloud:         { bg: "#F0F9FF", text: "#0369A1" },
  Entertainment: { bg: "#F5F3FF", text: "#7C3AED" },
  Productivity:  { bg: "#F0FDF4", text: "#15803D" },
  Education:     { bg: "#FFF7ED", text: "#C2410C" },
  Shopping:      { bg: "#FFF1F2", text: "#BE123C" },
  AI:            { bg: "#F0FDFA", text: "#0F766E" },
  Music:         { bg: "#FEF2F2", text: "#9F1239" },
  UCSD:          { bg: "#FFFBEB", text: "#92400E" },
};

function getBadgeStyle(badge: string): { bg: string; text: string } {
  if (badge === "Free")                        return { bg: "#22C55E", text: "#fff" };
  if (badge === "Discounted")                  return { bg: "#F59E0B", text: "#1C252E" };
  if (badge.includes("Credit"))                return { bg: "#F97316", text: "#fff" };
  if (badge.includes("/mo"))                   return { bg: "#8B5CF6", text: "#fff" };
  if (/month|year/i.test(badge))               return { bg: "#14B8A6", text: "#fff" };
  return { bg: "#395773", text: "#fff" };
}

export const DealCard: React.FC<DealCardProps> = ({
  name, description, category, url, badge,
  requires_edu, is_ucsd_specific, link_status, index,
}) => {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = Math.min(index * 50, 350);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 340, delay, useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0, delay, tension: 80, friction: 10, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const cat   = CATEGORY_STYLES[category] ?? { bg: "#EFF6FF", text: "#1D4ED8" };
  const badge_ = getBadgeStyle(badge);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Card
        backgroundColor="$surfaceDefault"
        borderRadius="$5"
        overflow="hidden"
        pressStyle={{ scale: 0.975, opacity: 0.9 }}
        animation="quick"
        elevation={2}
      >
        {/* UCSD gold top strip */}
        {is_ucsd_specific && (
          <XStack
            backgroundColor="#FEF3C7"
            paddingHorizontal="$4"
            paddingVertical="$1"
            alignItems="center"
          >
            <AppText style={styles.ucsdStrip}>🔱  UCSD Exclusive</AppText>
          </XStack>
        )}

        <YStack padding="$4" gap="$3">
          {/* Name + badge */}
          <XStack justifyContent="space-between" alignItems="flex-start" gap="$2">
            <AppText variant="title" fontSize="$4" flex={1} numberOfLines={1} color="$color">
              {name}
            </AppText>
            <XStack
              paddingHorizontal={10} paddingVertical={5}
              borderRadius={999} flexShrink={0}
              style={{ backgroundColor: badge_.bg }}
            >
              <AppText style={[styles.badge, { color: badge_.text }]}>{badge}</AppText>
            </XStack>
          </XStack>

          {/* Description */}
          <AppText variant="caption" color="$textMuted" numberOfLines={2} style={styles.desc}>
            {description}
          </AppText>

          {/* Footer */}
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$2" flex={1} flexWrap="wrap" alignItems="center">
              <XStack
                paddingHorizontal={10} paddingVertical={5} borderRadius={999}
                style={{ backgroundColor: cat.bg }}
              >
                <AppText style={[styles.catLabel, { color: cat.text }]}>{category}</AppText>
              </XStack>
              {requires_edu && (
                <XStack
                  paddingHorizontal={10} paddingVertical={5}
                  borderRadius={999} backgroundColor="$surfaceTintBlue"
                >
                  <AppText style={styles.eduLabel}>.edu required</AppText>
                </XStack>
              )}
              {/* Verification badge */}
              {link_status === "verified" ? (
                <XStack style={styles.verifiedChip} alignItems="center" gap={3}>
                  <AppText style={styles.verifiedText}>✓ Verified</AppText>
                </XStack>
              ) : (
                <XStack style={styles.uncheckedChip} alignItems="center" gap={3}>
                  <AppText style={styles.uncheckedText}>Unchecked</AppText>
                </XStack>
              )}
            </XStack>

            <TouchableOpacity
              onPress={() => Linking.openURL(url)}
              activeOpacity={0.75}
              style={styles.cta}
            >
              <AppText style={styles.ctaText}>Get Deal →</AppText>
            </TouchableOpacity>
          </XStack>
        </YStack>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ucsdStrip: { fontSize: 11, fontWeight: "700", color: "#92400E", letterSpacing: 0.3, paddingVertical: 3 },
  badge:     { fontSize: 11, fontWeight: "700" },
  desc:      { lineHeight: 19 },
  catLabel:  { fontSize: 11, fontWeight: "600" },
  eduLabel:  { fontSize: 11, color: "#0369A1", fontWeight: "500" },
  cta: {
    backgroundColor: "#395773",
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 999, marginLeft: 8, flexShrink: 0,
  },
  ctaText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
  verifiedChip: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 999,
  },
  verifiedText: { fontSize: 10, fontWeight: "700", color: "#15803D", letterSpacing: 0.2 },
  uncheckedChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 999,
  },
  uncheckedText: { fontSize: 10, fontWeight: "600", color: "#9CA3AF", letterSpacing: 0.2 },
});
