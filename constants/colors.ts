export const colors = {
  // Primary palette — matches the mobile design
  navy: "#0B192C", // Deep Navy Blue
  navyDark: "#07101D", // Deeper Navy
  navySoft: "#1E293B", // Slate Navy

  // Accent colors — Cyan family
  cyan: "#13c5dd", // Bright Cyan / Turquoise
  cyanLight: "#67e3f5", // Light Cyan
  cyanDark: "#0fa3c4", // Dark Cyan / Teal

  // Mobile store accents
  blue: "#0284C7",
  sky: "#38BDF8",
  blueSoft: "#E0F2FE",

  // Neutral tones
  aliceBlue: "#F8FAFC", // Off-white canvas
  ink: "#0F172A", // Ink
  slateGray: "#64748B", // Slate Gray
  border: "#E2E8F0",
  white: "#FFFFFF",

  // Backgrounds
  bg: "#F8FAFC",
  bgSoft: "#F8FAFC",
  card: "#FFFFFF", // White

  // Brand aliases (semantic)
  green: "#0B192C", // Deep Navy Blue
  darkGreen: "#07101D", // Deeper Navy
  lime: "#1E293B", // Slate Navy
  lightGreen: "#67e3f5", // Light Cyan

  // Support-section accents
  emerald: "#10b981", // Emerald Green
  emeraldDark: "#065f46", // Dark Emerald
  amber: "#f59e0b", // Amber
  amberSoft: "rgba(245,158,11,0.16)",

  // Status colors
  success: "#10b981", // Emerald Green
  warning: "#f59e0b", // Amber
  error: "#ef4444", // Coral Red
  info: "#0284C7", // Sky Blue

  // Grays
  gray: {
    50: "#f9fafb", // Ghost White
    100: "#f3f4f6", // White Smoke
    200: "#e5e7eb", // Gainsboro
    300: "#d1d5db", // Light Gray
    400: "#9ca3af", // Gray (X11)
    500: "#6b7280", // Dim Gray
    600: "#4b5563", // Dark Slate Gray
    700: "#374151", // Charcoal
    800: "#1f2937", // Gunmetal
    900: "#111827", // Eerie Black
  },

  // Status (semantic)
  status: {
    approved: "#0284C7", // Sky Blue
    pending: "#d97706", // Dark Amber / Ochre
    rejected: "#dc2626", // Crimson Red
    notSubmitted: "#0B192C", // Deep Navy Blue
  },

  statusBg: {
    approved: "#0284C710", // Sky Blue @ ~6% opacity
    pending: "#fef3c7", // Lemon Chiffon
    rejected: "#fef2f2", // Snow / Misty Rose
    notSubmitted: "#F8FAFC", // Off-white canvas
  },

  // Shadows (unchanged — no hex color names needed)
  shadow: {
    /* ... */
  },

  // Gradients
  gradients: {
    primary: ["#0B192C", "#07101D"], // Deep Navy → Deeper Navy
    accent: ["#13c5dd", "#0B192C"], // Cyan → Deep Navy
    success: ["#10b981", "#059669"], // Emerald → Dark Emerald
    warning: ["#f59e0b", "#d97706"], // Amber → Ochre
    error: ["#ef4444", "#dc2626"], // Coral Red → Crimson
  },
};
