import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { fetchChannels } from "../api";
import { Channel } from "../types";
import { theme } from "../theme";
import { ChannelCard } from "../components/ChannelCard";
import { SearchBar } from "../components/SearchBar";

type Props = {
  onSelect: (channel: Channel) => void;
  onChannelsLoaded: (channels: Channel[]) => void;
};

type Status = "loading" | "ready" | "error";

export function HomeScreen({ onSelect, onChannelsLoaded }: Props) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await fetchChannels();
      setChannels(data);
      onChannelsLoaded(data);
      setStatus(data.length ? "ready" : "error");
      if (!data.length) setErrorMessage("No channels found in feed.");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading channels."
      );
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const visibleChannels = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return channels;
    return channels.filter((c) => c.name.toLowerCase().includes(q));
  }, [channels, query]);

  const renderItem = useCallback(
    ({ item }: { item: Channel }) => (
      <ChannelCard channel={item} onPress={onSelect} />
    ),
    [onSelect]
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandTitle}>TV App</Text>
          </View>
          <Text style={styles.brandSubtitle}>{channels.length} channels</Text>
        </View>

        <View style={styles.searchWrap}>
          <SearchBar value={query} onChange={setQuery} />
        </View>

        {status === "loading" && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
            <Text style={styles.centerText}>Loading channels...</Text>
          </View>
        )}

        {status === "error" && (
          <View style={styles.center}>
            <Text style={styles.errorTitle}>Couldn't load channels</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable style={styles.retryBtn} onPress={load}>
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        )}

        {status === "ready" && (
          <FlatList
            data={visibleChannels}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.accent}
              />
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.errorText}>
                  No channels match "{query}".
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.accent,
  },
  brandTitle: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  searchWrap: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.xxl,
  },
  centerText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  errorTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  errorText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
  },
  retryText: {
    color: theme.colors.bg,
    fontWeight: "700",
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  row: {
    gap: theme.spacing.md,
  },
});