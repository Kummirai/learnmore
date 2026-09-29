import { API_BASE } from "@/lib/config";

export type ClubEvent = {
  id: string;
  title: string;
  /** ISO date (YYYY-MM-DD) the event starts. */
  date: string;
  time?: string;
  location?: string;
  fee?: string;
  description?: string;
  imageUrl?: string;
};

/**
 * Upcoming events created in a club — read server-side from the backend so
 * each club page carries its own "Events & Activities" dates instead of
 * sending everyone to the global /events hub.
 */
export async function getClubEvents(clubSlug: string): Promise<ClubEvent[]> {
  if (!clubSlug) return [];
  try {
    const res = await fetch(
      `${API_BASE}/api/community/events?club=${encodeURIComponent(clubSlug)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const json: unknown = await res.json();
    const list = Array.isArray(json) ? json : (json as { data?: unknown })?.data;
    if (!Array.isArray(list)) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return list
      .flatMap((raw) => {
        const e = raw as Record<string, unknown>;
        const date =
          typeof e.date === "string" ? e.date.slice(0, 10) : undefined;
        const id = String(e._id ?? e.id ?? "");
        const title = typeof e.title === "string" ? e.title : "";
        if (!id || !title || !date) return [];
        return [
          {
            id,
            title,
            date,
            time: typeof e.time === "string" ? e.time : undefined,
            location:
              typeof e.location === "string" ? e.location : undefined,
            fee: typeof e.fee === "string" ? e.fee : undefined,
            description:
              typeof e.description === "string" ? e.description : undefined,
            imageUrl:
              typeof e.imageUrl === "string" && e.imageUrl
                ? e.imageUrl
                : undefined,
          } satisfies ClubEvent,
        ];
      })
      .filter((e) => new Date(`${e.date}T00:00:00`).getTime() >= today.getTime())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6);
  } catch {
    return [];
  }
}
