import React from 'react';
import { ScrollView } from 'react-native';
import { Screen } from '../components/primitives/Screen';
import { AppText } from '../components/primitives/AppText';
import { AppButton } from '../components/primitives/AppButton';
import { StatCard } from '../components/primitives/StatCard';
import { DonutCard } from '../components/primitives/DonutCard';
import { QuickActionCard } from '../components/primitives/QuickActionCard';
import { SegmentedControl } from '../components/primitives/SegmentedControl';
import { YStack, XStack, Circle } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export default function DemoScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <YStack space="$6" paddingBottom="$10">
          
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center" marginTop="$4">
            <Circle size={44} backgroundColor="$white" elevation={1}>
              <Ionicons name="notifications-outline" size={20} color="#1C252E" />
            </Circle>
            <Circle size={44} backgroundColor="$primary">
              <AppText color="white" fontWeight="bold">JD</AppText>
            </Circle>
          </XStack>

          <YStack space="$1">
            <AppText variant="title" fontSize="$8">Welcome Back,</AppText>
            <AppText variant="subtitle" color="$textMuted">Jordan 👋</AppText>
          </YStack>

          {/* Stats Row */}
          <XStack space="$3">
            <StatCard 
              title="Daily Spending" 
              value="$42.50" 
              subtitle="Under budget" 
              backgroundColor="$surfaceTintBlue" 
              icon={<Ionicons name="trending-up" size={16} color="#395773" />} 
            />
            <StatCard 
              title="Goals" 
              value="3 of 5" 
              subtitle="On track" 
              backgroundColor="$surfaceTintBlue" 
              icon={<Ionicons name="disc-outline" size={16} color="#395773" />} 
            />
          </XStack>
          
          {/* Weekly Spending */}
          <DonutCard title="Weekly Spending" centerMetric="68%" />

          {/* Quick Actions */}
          <YStack space="$4">
            <AppText variant="title" fontSize="$6">Quick Actions</AppText>
            <XStack space="$3">
              <QuickActionCard 
                label="Save More" 
                icon={<AppText fontSize="$5">💰</AppText>} 
                backgroundColor="$surfaceTintYellow" 
              />
              <QuickActionCard 
                label="Track Bills" 
                icon={<AppText fontSize="$5">📄</AppText>} 
                backgroundColor="$surfaceTintGreen" 
              />
              <QuickActionCard 
                label="Set Goals" 
                icon={<AppText fontSize="$5">🎯</AppText>} 
                backgroundColor="$surfaceTintGreen" // using green as fallback for the third from design
              />
            </XStack>
          </YStack>

          {/* Add Expense Button */}
          <YStack alignItems="center" marginTop="$2">
            <AppButton variant="primary" paddingHorizontal="$8">
              + Add Expense
            </AppButton>
          </YStack>

          {/* Segmented Control Demo */}
          <YStack space="$4" marginTop="$6">
            <AppText variant="title" fontSize="$6">Segmented Control Example</AppText>
            <SegmentedControl defaultValue="1W" />
          </YStack>

        </YStack>
      </ScrollView>
    </Screen>
  );
}
