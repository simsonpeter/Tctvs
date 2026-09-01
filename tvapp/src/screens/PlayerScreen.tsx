import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvent, useEventListener } from "expo";
import { useVideoPlayer, VideoView, VideoSource } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { Channel } from "../types";
import { theme } from "../theme";
import { ChannelLogo } from "../components/ChannelLogo";

type Props = {
  channel: Channel;
  channels: Channel[];
  onSwitchChannel: (channel: Channel) => void;
  onClose: () => void;
};

const toSource = (url: string): VideoSource => ({ uri: url });

export function PlayerScreen({
  channel,
  channels,
  onSwitchChannel,
  onClose,
}: Props) {
  const player = useVideoPlayer(toSource(channel.streamUrl), (p) => {
    p.loop = true;
    p.play();
  });

  const { status } = useEvent(player, "statusChange", { status: player.status });
  const [loading, setLoading] = useState(true);

  useEventListener(player, "statusChange", ({ status: s }) => {
    setLoading(s === "loading");
  });

  const currentIndex = channels.findIndex((c) => c.id === channel.id);

  const switchTo = useCallback(
    (dir: 1 | -1) => {
      const next = currentIndex + dir;
      if (next < 0 || next >= channels.length) return;
      onSwitchChannel(channels[next]);
    },
    [currentIndex, channels, onSwitchChannel]
  );

  const handleEnterFullscreen = () => setLoading(false);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.nowPlaying}>
            <Text style={styles.liveBadge}>
              {status === "readyToPlay" ? "● LIVE" : "LOADING"}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {channel.name}
            </Text>
          </View>
          <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={22} color={theme.colors.text} />
          </Pressable>
        </View>

        <View style={styles.videoWrap}>
          <VideoView
            player={player}
            style={styles.video}
            nativeControls
            contentFit="contain"
            fullscreenOptions={{ enable: true }}
            onFirstFrameRender={handleEnterFullscreen}
          />
          {loading && (
            <View style={styles.videoOverlay} pointerEvents="none">
              <ActivityIndicator size="large" color={theme.colors.accent} />
            </View>
          )}
        </View>

        <View style={styles.channelInfo}>
          <ChannelLogo uri={channel.logo} name={channel.name} size="medium" />
          <Text style={styles.channelName}>{channel.name}</Text>
          <Text style={styles.channelHint}>
            Channel {currentIndex + 1} of {channels.length}
          </Text>
        </View>

        <View style={styles.controls}>
          <Pressable
            style={({ pressed }) => [
              styles.navBtn,
              (pressed || currentIndex === 0) && styles.navBtnMuted,
            ]}
            disabled={currentIndex === 0}
            onPress={() => switchTo(-1)}
          >
            <Ionicons
              name="play-skip-back"
              size={20}
              color={currentIndex === 0 ? theme.colors.textMuted : theme.colors.text}
            />
            <Text style={styles.navBtnText}>Previous</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.navBtn,
              (pressed || currentIndex === channels.length - 1) &&
                styles.navBtnMuted,
            ]}
            disabled={currentIndex === channels.length - 1}
            onPress={() => switchTo(1)}
          >
            <Ionicons
              name="play-skip-forward"
              size={20}
              color={
                currentIndex === channels.length - 1
                  ? theme.colors.textMuted
                  : theme.colors.text
              }
            />
            <Text style={styles.navBtnText}>Next</Text>
          </Pressable>
        </View>

        <Text style={styles.footerHint}>Use swipe or buttons to change channel</Text>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  nowPlaying: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  liveBadge: {
    backgroundColor: theme.colors.danger,
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  videoWrap: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    marginHorizontal: theme.spacing.lg,
  },
  video: {
    flex: 1,
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  channelInfo: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  channelName: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  channelHint: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xl,
  },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: theme.radius.pill,
  },
  navBtnMuted: {
    opacity: 0.5,
  },
  navBtnText: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  footerHint: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: "auto",
    paddingBottom: theme.spacing.lg,
  },
});