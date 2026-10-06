import { API_BASE } from "@/lib/config";

export type ProgramCalendarEntry = {
  id: string;
  /** ISO date (YYYY-MM-DD) the session runs on. */
  date: string;
  endDate?: string;
  title: string;
  description?: string;
  term?: string;
  time?: string;
  location?: string;
  setting?: string;
};

export type ProgramCalendar = {
  clubSlug: string;
  year: number;
  entries: ProgramCalendarEntry[];
};

/**
 * Server fetch of a club's year calendar (March → November by convention).
 * The backend answers with an empty entry list when a club has no calendar
 * yet, so "nothing published" is never an error — the club page falls back to
 * the pillar list until someone authors one in /admin/program-calendar.
 */
export async function getProgramCalendar(
  clubSlug: string,
  year?: number,
): Promise<ProgramCalendar | null> {
  if (!clubSlug) return null;
  try {
    const qs = year ? `?year=${year}` : "";
    const res = await fetch(
      `${API_BASE}/api/clubs/${encodeURIComponent(clubSlug)}/calendar${qs}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const json = (await res.json().catch(() => null)) as
      | {
          clubSlug?: string;
          year?: number;
          entries?: unknown;
        }
      | null;
    if (!json || !Array.isArray(json.entries)) return null;
    return {
      clubSlug: typeof json.clubSlug === "string" ? json.clubSlug : clubSlug,
      year: Number.isInteger(json.year) ? (json.year as number) : 0,
      entries: json.entries as ProgramCalendarEntry[],
    };
  } catch {
    return null;
  }
}
