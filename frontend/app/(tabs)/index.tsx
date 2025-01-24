import React, { useState } from 'react';

import { Image, StyleSheet, Platform, View, TouchableOpacity } from 'react-native';
import { HelloWave } from '@/components/HelloWave'; // Custom component for a wave animation
import ParallaxScrollView from '@/components/ParallaxScrollView'; // Custom parallax scroll view component
import { ThemedText } from '@/components/ThemedText'; // Custom themed text component
import { ThemedView } from '@/components/ThemedView'; // Custom themed view component

//dropdown menu base
interface DropdownProps {
  data: { value: string; label: string }[]; // Array of objects containing 'value' and 'label'
  onSelect: (item: { value: string; label: string }) => void; // Function that takes an item and does something with it
}

//dropdown menu components
const Dropdown: React.FC<DropdownProps> = ({ data, onSelect }) => {
  return (
    <View style={styles.dropdownMenu}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.value}
          style={styles.dropdownItem}
          onPress={() => onSelect(item)}
        >
          <ThemedText>{item.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // have to initially set it to null

  // function that helps with the choosing of an option
  const handleSelect = (item: { value: string; label: string }) => {
    setSelectedOption(item.label); // Update selected option based on the label
    console.log('Selected item:', item); // Log the selected item
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>

      {/* Expense Transaction Sheet */}
      <ThemedText type="subtitle">Expense Transaction Sheet </ThemedText>

      <ThemedText type="defaultSemiBold">Categories of Spending </ThemedText>


      {/* Add the Dropdown menu below the text */}
      <Dropdown 
        data={[
          { value: '1', label: 'Entertainment' },
          { value: '2', label: 'Food' },
          { value: '3', label: 'Transportation' },
          { value: '4', label: 'Rent or Mortgage' },
          { value: '5', label: 'Savings' },
          { value: '6', label: 'Other' },
        ]}
        onSelect={handleSelect} // Pass the handleSelect function to update selectedOption
      />
      
      {/* Optionally display the selected option */}
      {selectedOption && <ThemedText>Input the Amount you spent on {selectedOption}: $_____</ThemedText>}
    </ParallaxScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  // Style for the dropdown menu
  dropdownMenu: {
    backgroundColor: '#f1f1f1', //light grey color
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: 200,
  },
  // Style for each dropdown item
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
