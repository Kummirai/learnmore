import { API_BASE } from "@/lib/config";

/**
 * Skills framework loading — club-agnostic.
 *
 * Skills, levels and requirements come from GET /api/skills?club=<slug>
 * (rewritten to the backend by next.config so cookies stay first-party).
 * Network and HTTP failures throw so callers can render an explicit error
 * state — there is no bundled fallback anywhere in this module.
 */

export type SkillLevelId = string;

export type SkillLevel = {
  id: SkillLevelId;
  name: string;
  description?: string;
  color: string;
  colorDark: string;
  order: number;
};

export type SkillRequirement = {
  text: string;
  criteria: string[];
};

export type Skill = {
  id: string;
  name: string;
  description?: string;
  clubSlug: string;
  levelId: SkillLevelId;
  icon?: string;
  /** Royalty-free photo shown on the skill card. */
  image?: string;
  color?: string;
  requirements: SkillRequirement[];
};

export type SkillProgress = {
  checks: boolean[];
  criteria?: boolean[][];
  status: "not_started" | "in_progress" | "complete";
  enrolledAt?: string | null;
  updatedAt?: string;
  completedAt?: string | null;
};

/** One loaded skills catalog plus the lookups every skills view needs. */
export type SkillsCatalog = {
  clubSlug: string;
  clubName: string;
  clubColor: string;
  clubColorDark: string;
  skills: Skill[];
  levels: SkillLevel[];
  levelById: Record<SkillLevelId, SkillLevel>;
  count: number;
  getSkill(skillId: string): Skill | undefined;
  getLevel(levelId: SkillLevelId): SkillLevel | undefined;
  skillsByLevel(levelId: SkillLevelId): Skill[];
};

/** Shape-checks the API payload and wires the derived lookups onto it. */
function buildSkillsCatalog(raw: unknown, clubSlug: string, clubName: string): SkillsCatalog {
  const payload = raw as {
    club?: { slug?: string; name?: string; color?: string; colorDark?: string };
    levels?: unknown;
    skills?: unknown;
    skillCount?: unknown;
  } | null;

  if (!payload || !Array.isArray(payload.levels) || !Array.isArray(payload.skills)) {
    throw new Error("unexpected skills payload");
  }

  const levels = payload.levels as SkillLevel[];
  const skills = payload.skills as Skill[];
  const levelById = Object.fromEntries(
    levels.map((l) => [l.id, l]),
  ) as Record<SkillLevelId, SkillLevel>;

  const sortedLevels = [...levels].sort((a, b) => a.order - b.order);
  const sortedSkills = [...skills].sort((a, b) => {
    const la = levelById[a.levelId];
    const lb = levelById[b.levelId];
    const ao = la?.order ?? 0;
    const bo = lb?.order ?? 0;
    if (ao !== bo) return ao - bo;
    return a.name.localeCompare(b.name);
  });

  const count = typeof payload.skillCount === "number"
    ? payload.skillCount
    : sortedSkills.length;

  return {
    clubSlug: payload.club?.slug ?? clubSlug,
    clubName: payload.club?.name ?? clubName,
    clubColor: payload.club?.color ?? "#13c5dd",
    clubColorDark: payload.club?.colorDark ?? "#0fa3c4",
    skills: sortedSkills,
    levels: sortedLevels,
    levelById,
    count,
    getSkill(skillId) {
      return sortedSkills.find((s) => s.id === skillId);
    },
    getLevel(levelId) {
      return levelById[levelId];
    },
    skillsByLevel(levelId) {
      return sortedSkills.filter((s) => s.levelId === levelId);
    },
  };
}

/** Server-side skills catalog for a specific club. */
export async function getSkills(clubSlug: string): Promise<SkillsCatalog> {
  const clubName = clubSlug
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/-./g, (m) => m[1].toUpperCase());
  const res = await fetch(`${API_BASE}/api/skills?club=${encodeURIComponent(clubSlug)}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`skills api ${res.status}`);
  return buildSkillsCatalog(await res.json(), clubSlug, clubName);
}

/** Shared request behind every client consumer — one fetch per page load. */
const skillsRequestMap: Record<string, Promise<SkillsCatalog>> = {};

/**
 * Client-side load over the relative /api path (rewritten by next.config).
 * The settled promise — success or failure — is cached at module level, so a
 * failed catalog load surfaces `error` once for every component on the page
 * instead of retrying per mount.
 */
export function loadSkills(clubSlug: string): Promise<SkillsCatalog> {
  if (!skillsRequestMap[clubSlug]) {
    skillsRequestMap[clubSlug] = (async () => {
      const res = await fetch(`/api/skills?club=${encodeURIComponent(clubSlug)}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`skills api ${res.status}`);
      const clubName = clubSlug
        .replace(/^./, (c) => c.toUpperCase())
        .replace(/-./g, (m) => m[1].toUpperCase());
      return buildSkillsCatalog(await res.json(), clubSlug, clubName);
    })();
  }
  return skillsRequestMap[clubSlug];
}
