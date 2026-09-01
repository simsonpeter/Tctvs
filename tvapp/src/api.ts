import { Channel } from "./types";

const FEED_URL =
  "https://raw.githubusercontent.com/simsonpeter/Tctvs/refs/heads/main/tv.json";

const TIMEOUT_MS = 15000;

function isChannel(value: unknown): value is Channel {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.name === "string" &&
    typeof v.logo === "string" &&
    typeof v.streamUrl === "string"
  );
}

export async function fetchChannels(): Promise<Channel[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(FEED_URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to load channels (HTTP ${response.status})`);
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Unexpected data format received from server");
    }
    return data.filter(isChannel);
  } finally {
    clearTimeout(timer);
  }
}