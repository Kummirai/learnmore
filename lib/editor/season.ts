/**
 * Season / study-guide calendar helpers for the admin magazine editor.
 *
 * Mirrors relateWorld/backend/lib/season.ts: a seasonal study guide is built
 * from a canonical 7-day-per-week calendar derived from the season's start/end
 * dates, so the web reads the exact same shape the Expo app renders.
 *
 * Only the client-safe helpers the editor needs live here — sanitization and
 * persistence stay on the backend API.
 */

export type InteractiveBlockTypes = "checklist" | "quiz" | "reflection" | "pray";

/** An image or quote placed inline within a reading structure slot. */
export type ReadingMedia =
  | { type: "image"; uri: string; caption?: string }
  | { type: "quote"; text: string; by?: string; source?: string };

export type ReadingStructure = {
  intro: {
    hook: string;
    thesis: string;
    beforeHook?: ReadingMedia[];
    afterHook?: ReadingMedia[];
    afterThesis?: ReadingMedia[];
  };
  body: {
    topic: string;
    support: string[];
    closing?: string;
    beforeTopic?: ReadingMedia[];
    afterTopic?: ReadingMedia[];
    afterSupport?: ReadingMedia[];
    afterClosing?: ReadingMedia[];
  }[];
  conclusion: {
    restate: string;
    whyItMatters: string;
    closing: string;
    beforeRestate?: ReadingMedia[];
    afterRestate?: ReadingMedia[];
    afterWhyItMatters?: ReadingMedia[];
    afterClosing?: ReadingMedia[];
  };
};

export type PubBlock = {
  type:
    | "paragraph"
    | "heading"
    | "quote"
    | "image"
    | "list"
    | "reading"
    | InteractiveBlockTypes;
  id?: string;
  text?: string;
  by?: string;
  source?: string;
  uri?: string;
  caption?: string;
  items?: string[];
  title?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explain?: string;
  prompt?: string;
  placeholder?: string;
  structure?: ReadingStructure;
};

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISO(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate(),
  ).padStart(2, "0")}`;
}

function validISO(iso: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) && !isNaN(parseISO(iso).getTime());
}

export type SeasonDay = { date: string; day: number; weekday: string };

/** One entry per calendar day of the season. */
export function buildSeasonDays(
  startISO: string,
  endISO: string,
): SeasonDay[] {
  if (!validISO(startISO) || !validISO(endISO)) return [];
  const start = parseISO(startISO);
  const end = parseISO(endISO);
  if (start > end) return [];
  const days: SeasonDay[] = [];
  let dayNumber = 1;
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push({ date: toISO(d), day: dayNumber, weekday: WEEKDAYS[d.getUTCDay()] });
    dayNumber += 1;
  }
  return days;
}

/** 7-day weeks from the season range. */
export function buildWeeks(
  startISO: string,
  endISO: string,
): { index: number; days: SeasonDay[] }[] {
  const days = buildSeasonDays(startISO, endISO);
  const weeks: { index: number; days: SeasonDay[] }[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push({ index: weeks.length + 1, days: days.slice(i, i + 7) });
  }
  return weeks;
}

export function emptyReading(): ReadingStructure {
  return {
    intro: {
      hook: "",
      thesis: "",
      beforeHook: [],
      afterHook: [],
      afterThesis: [],
    },
    body: [
      {
        topic: "",
        support: [],
        closing: "",
        beforeTopic: [],
        afterTopic: [],
        afterSupport: [],
        afterClosing: [],
      },
    ],
    conclusion: {
      restate: "",
      whyItMatters: "",
      closing: "",
      beforeRestate: [],
      afterRestate: [],
      afterWhyItMatters: [],
      afterClosing: [],
    },
  };
}

/** True when the reading carries any text or inline media worth persisting. */
export function readingHasContent(r?: ReadingStructure | null): boolean {
  if (!r) return false;
  const has = (m?: ReadingMedia[]) => (m?.length ?? 0) > 0;
  const intro = r.intro ?? emptyReading().intro;
  const conclusion = r.conclusion ?? emptyReading().conclusion;
  const body = Array.isArray(r.body) ? r.body : [];
  return !!(
    intro.hook ||
    intro.thesis ||
    has(intro.beforeHook) ||
    has(intro.afterHook) ||
    has(intro.afterThesis) ||
    body.some(
      (b) =>
        b.topic ||
        (b.support?.length ?? 0) > 0 ||
        b.closing ||
        has(b.beforeTopic) ||
        has(b.afterTopic) ||
        has(b.afterSupport) ||
        has(b.afterClosing),
    ) ||
    conclusion.restate ||
    conclusion.whyItMatters ||
    conclusion.closing ||
    has(conclusion.beforeRestate) ||
    has(conclusion.afterRestate) ||
    has(conclusion.afterWhyItMatters) ||
    has(conclusion.afterClosing)
  );
}