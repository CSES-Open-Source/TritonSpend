import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function SearchBar(props: any) {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.search}
        onChangeText={props.setSearch}
        placeholder="Search for goals.."
        value={props.search}
        focusable={false}
      />
      <AntDesign name="search1" size={25} />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    height: 40,
    width: "100%",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
