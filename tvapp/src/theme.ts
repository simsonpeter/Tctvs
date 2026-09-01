export const theme = {
  colors: {
    bg: "#0B0E14",
    surface: "#141924",
    surfaceAlt: "#1B2230",
    border: "#242E3E",
    text: "#F2F5F9",
    textMuted: "#8A94A6",
    accent: "#22D3EE",
    accentSoft: "rgba(34, 211, 238, 0.15)",
    success: "#34D399",
    danger: "#F87171",
    white: "#FFFFFF",
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
  },
} as const;

export type Theme = typeof theme;