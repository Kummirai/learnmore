/** Legacy records predate auto-activation — map every status we've stored. */
export type StatusInfo = {
  label: string;
  /** Chip styling for dark surfaces (the card, the hero). */
  chip: string;
  /** Chip styling for light surfaces (the record, panels). */
  chipLight: string;
  /** Where the member sits in the status timeline. */
  tone: "done" | "wait" | "off";
  note: string;
};

export const STATUS_LABELS: Record<string, StatusInfo> = {
  active: {
    label: "Active member",
    chip: "bg-gold-500 text-navy-dark",
    chipLight: "bg-gold-100 text-gold-800 ring-1 ring-gold-300",
    tone: "done",
    note: "Your membership is live — nothing else to do to keep it.",
  },
  accepted: {
    label: "Active member",
    chip: "bg-gold-500 text-navy-dark",
    chipLight: "bg-gold-100 text-gold-800 ring-1 ring-gold-300",
    tone: "done",
    note: "Your membership is live — nothing else to do to keep it.",
  },
  pending_interview: {
    label: "Under review",
    chip: "bg-white/10 text-white ring-1 ring-white/25",
    chipLight: "bg-navy/5 text-navy ring-1 ring-navy/15",
    tone: "wait",
    note: "Your leader is checking your details. You'll be contacted on WhatsApp.",
  },
  rejected: {
    label: "Not active",
    chip: "bg-white/10 text-white/60 ring-1 ring-white/15",
    chipLight: "bg-gray-100 text-slate-gray ring-1 ring-gray-200",
    tone: "off",
    note: "This record isn't active. Speak to your leader, or register again.",
  },
};

export const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** "#13c5dd" + 0.4 → "#13c5dd66" (8-digit hex with alpha). */
export const withAlpha = (hex: string, alpha: number) =>
  `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")}`;

export function formatDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatFixtureDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Deterministic bar widths for the printed-style barcode on the card —
 * derived from the reference so every member's card is their own.
 */
export function barcodeBars(seed: string): number[] {
  const source = seed || "RELATE000000";
  const bars: number[] = [];
  for (let i = 0; i < 44; i++) {
    const code = source.charCodeAt(i % source.length) * (i + 3);
    bars.push((code % 3) + 1);
  }
  return bars;
}
