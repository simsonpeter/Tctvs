import React, { useState } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { theme } from "../theme";

type Props = {
  uri: string;
  name: string;
  size?: "small" | "medium";
};

export function ChannelLogo({ uri, name, size = "small" }: Props) {
  const [failed, setFailed] = useState(false);
  const dimension = size === "small" ? 84 : 120;

  return (
    <View
      style={[
        styles.wrapper,
        { width: dimension, height: dimension },
      ]}
    >
      {failed ? (
        <View style={styles.fallback}>
          <Text style={styles.fallbackLetter}>
            {name.trim().charAt(0).toUpperCase()}
          </Text>
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="contain"
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.md,
    overflow: "hidden",
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accentSoft,
  },
  fallbackLetter: {
    color: theme.colors.accent,
    fontSize: 36,
    fontWeight: "800",
  },
});