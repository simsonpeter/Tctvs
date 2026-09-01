import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";

type Props = {
  value: string;
  onChange: (text: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={theme.colors.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Search channels..."
        placeholderTextColor={theme.colors.textMuted}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Ionicons
          name="close-circle"
          size={18}
          color={theme.colors.textMuted}
          onPress={() => onChange("")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    height: "100%",
  },
});