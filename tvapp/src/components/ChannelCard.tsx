import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Channel } from "../types";
import { theme } from "../theme";
import { ChannelLogo } from "./ChannelLogo";

type Props = {
  channel: Channel;
  onPress: (channel: Channel) => void;
};

export function ChannelCard({ channel, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(channel)}
    >
      <View style={styles.logoWrap}>
        <ChannelLogo uri={channel.logo} name={channel.name} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {channel.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  cardPressed: {
    borderColor: theme.colors.accent,
    transform: [{ scale: 0.97 }],
  },
  logoWrap: {
    marginBottom: theme.spacing.md,
  },
  name: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 17,
  },
});