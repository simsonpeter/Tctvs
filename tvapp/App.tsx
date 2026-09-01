import React, { useCallback, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./src/screens/HomeScreen";
import { PlayerScreen } from "./src/screens/PlayerScreen";
import { Channel } from "./src/types";

export default function App() {
  const [selected, setSelected] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);

  const handleSelect = useCallback((channel: Channel) => {
    setSelected(channel);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <SafeAreaProvider>
      {selected ? (
        <PlayerScreen
          channel={selected}
          channels={channels}
          onSwitchChannel={setSelected}
          onClose={handleClose}
        />
      ) : (
        <HomeScreen
          onSelect={handleSelect}
          onChannelsLoaded={setChannels}
        />
      )}
    </SafeAreaProvider>
  );
}
