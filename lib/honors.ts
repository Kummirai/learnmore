import { API_BASE } from "@/lib/config";

/**
 * Sprout honors framework loading.
 *
 * The honors experience is strictly API-driven: tracks, levels, badges and
 * shape labels come from GET /api/sprout/honors (rewritten to the backend by
 * next.config so cookies stay first-party). Network and HTTP failures throw so
 * callers can render an explicit error state — there is no bundled fallback
 * anywhere in this module.
 */

export type HonorTrackId =
  | "safety"
  | "finance"
  | "productivity"
  | "code"
  | "media";

export type HonorTrack = {
  id: HonorTrackId;
  name: string;
  short: string;
  blurb: string;
  color: string;
  /** Card artwork — one photo per track, shared by every page that shows it. */
  image: string;
  /** Only offered at the teen level (the fifth track). */
  teensOnly?: boolean;
};

export type HonorShape = "patch" | "shield" | "pin";

/**
 * One requirement of a badge, plus the measurable standards that prove it.
 * Every criterion carries a number, count or verifiable action so a leader
 * can pass/fail it without judgement calls. All criteria ticked = proven.
 */
export type HonorRequirement = {
  /** The headline requirement — shown on cards, in metadata and summaries. */
  text: string;
  /** Measurable pass criteria, checked one by one in the progress panel. */
  criteria: string[];
};

export type HonorBadge = {
  id: string;
  name: string;
  track: HonorTrackId;
  shape: HonorShape;
  /** How the badge looks — a patch, shield patch or lapel pin. */
  concept: string;
  /**
   * Money honors only: what a participant banks each week and how many weeks
   * the course runs (weekly × weeks = the piggy-bank target shown live).
   */
  piggyBank?: { weekly: number; weeks: number };
  requirements: HonorRequirement[];
};

export type HonorLevel = {
  id: "kids" | "tweens" | "teens";
  levelNumber: number;
  name: string;
  ageBand: string;
  focus: string;
  color: string;
  colorDark: string;
  clubSlug: string;
  badges: HonorBadge[];
};

export type HonorEntry = {
  level: HonorLevel;
  badge: HonorBadge;
  track: HonorTrack;
};

/** One loaded framework plus the lookups every honors view needs. */
export type Honors = {
  tracks: HonorTrack[];
  levels: HonorLevel[];
  /** Every honor, flattened for detail routes and the honors directory. */
  entries: HonorEntry[];
  trackById: Record<HonorTrackId, HonorTrack>;
  shapeLabels: Record<HonorShape, string>;
  count: number;
  /** Look one honor up by its URL id (e.g. "first-responder"). */
  getHonor(badgeId: string): HonorEntry | undefined;
  /** The level whose age band a Sprout sub-club page shows (sprout-kids). */
  honorLevelForClub(clubSlug: string): HonorLevel | undefined;
  /** The honor before/after another in framework order (for prev/next links). */
  neighborHonors(badgeId: string): { prev?: HonorEntry; next?: HonorEntry };
  honorWhereEarned(entry: HonorEntry): string;
  /** The overview matrix: one cell per level × track (null when not offered). */
  honorMatrix(): (HonorBadge | null)[][];
};

/**
 * Where a given honor gets worked on — weekly club for every level, with the
 * camp-specific honors called out (the camp is where safety officers are made).
 */
export function honorWhereEarned(entry: HonorEntry): string {
  const base = `Practised at weekly ${entry.level.name} sessions, then proven in front of a leader who signs each requirement off.`;
  const campHonors = ["first-responder", "media-communications"];
  return campHonors.includes(entry.badge.id)
    ? `${base} This one also gets signed off in the field — at Sprout Camp or a Sprout Sports outing.`
    : base;
}

/** Shape-checks the API payload and wires the derived lookups onto it. */
function buildHonors(raw: unknown): Honors {
  const payload = raw as {
    tracks?: unknown;
    levels?: unknown;
    shapeLabels?: unknown;
    honorCount?: unknown;
  } | null;
  if (
    !payload ||
    !Array.isArray(payload.tracks) ||
    !Array.isArray(payload.levels) ||
    !payload.shapeLabels ||
    typeof payload.shapeLabels !== "object"
  ) {
    throw new Error("unexpected honors payload");
  }

  const tracks = payload.tracks as HonorTrack[];
  const levels = payload.levels as HonorLevel[];
  const shapeLabels = payload.shapeLabels as Record<HonorShape, string>;
  const trackById = Object.fromEntries(
    tracks.map((t) => [t.id, t]),
  ) as Record<HonorTrackId, HonorTrack>;
  const entries: HonorEntry[] = levels.flatMap((level) =>
    level.badges.map((badge) => ({
      level,
      badge,
      track: trackById[badge.track],
    })),
  );

  return {
    tracks,
    levels,
    entries,
    trackById,
    shapeLabels,
    count:
      typeof payload.honorCount === "number"
        ? payload.honorCount
        : entries.length,
    getHonor(badgeId) {
      return entries.find((e) => e.badge.id === badgeId);
    },
    honorLevelForClub(clubSlug) {
      return levels.find((l) => l.clubSlug === clubSlug);
    },
    neighborHonors(badgeId) {
      const i = entries.findIndex((e) => e.badge.id === badgeId);
      if (i < 0) return {};
      return { prev: entries[i - 1], next: entries[i + 1] };
    },
    honorWhereEarned,
    honorMatrix() {
      return levels.map((level) =>
        tracks.map(
          (track) => level.badges.find((b) => b.track === track.id) ?? null,
        ),
      );
    },
  };
}

/** Server-side framework. Throws on network/HTTP failure; never falls back. */
export async function getHonors(): Promise<Honors> {
  const res = await fetch(`${API_BASE}/api/sprout/honors`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`honors api ${res.status}`);
  return buildHonors(await res.json());
}

/** Shared request behind every client consumer — one fetch per page load. */
let honorsRequest: Promise<Honors> | null = null;

/**
 * Client-side load over the relative /api path (rewritten by next.config).
 * The settled promise — success or failure — is cached at module level, so a
 * failed framework load surfaces `error` once for every component on the page
 * instead of retrying per mount. Safe to import from Server Components; client
 * components reach it through `useHonors()` in `@/lib/useHonors`.
 */
export function loadHonors(): Promise<Honors> {
  if (!honorsRequest) {
    honorsRequest = (async () => {
      const res = await fetch("/api/sprout/honors", { cache: "no-store" });
      if (!res.ok) throw new Error(`honors api ${res.status}`);
      return buildHonors(await res.json());
    })();
  }
  return honorsRequest;
}
