import type { RelateSport } from "@/constants/relate";
import { API_BASE } from "@/lib/config";
import {
  playerSlug,
  type Player,
  type Squad,
  type SportsData,
} from "@/lib/sports";

/** A row of POST /api/sports/registrations (safe public fields only). */
export type RegisteredPlayer = {
  id: string;
  teamId: string;
  clubSlug: string;
  sport: RelateSport;
  position: string;
  positionCode: string;
  name: string;
  photoUrl: string;
  heightCm: number;
  foot: "left" | "right";
  hand: "left" | "right";
  status: "active" | "waitlist";
  /** 1-based position in the queue for that position. */
  order: number;
  createdAt: string;
};

export type PositionCount = { taken: number; capacity: number };

export type Slot = {
  position: string;
  number: number;
  badge: string;
  /** The registrant filling this slot, or null while it is still open. */
  registrant: RegisteredPlayer | null;
  /** The generated placeholder the slot falls back to. */
  placeholder: Player;
};

export type SquadRoster = {
  slots: Slot[];
  /** Registered beyond the team sheet but inside the position cap. */
  reserves: RegisteredPlayer[];
  /** Past the per-position cap — kept, not turned away. */
  waitlist: RegisteredPlayer[];
  counts: Record<string, PositionCount>;
  registered: number;
};

/**
 * Overlays real registrations onto the team sheet from the catalogue.
 *
 * Slots fill in registration order within each position, so the first
 * applicants are the ones who show up as the starting N; anyone past their
 * slot count lands in reserves, and anyone past the position cap waits.
 * The slot list and the per-position cap come from the catalog, which is the
 * backend's copy — nothing here knows the rules on its own.
 */
export function buildRoster(
  squad: Squad,
  registered: RegisteredPlayer[],
  sport: RelateSport,
  catalog: SportsData,
): SquadRoster {
  const active = registered.filter((r) => r.status === "active");
  const waitlist = registered
    .filter((r) => r.status === "waitlist")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const queueByPosition = new Map<string, RegisteredPlayer[]>();
  for (const row of active) {
    const list = queueByPosition.get(row.position);
    if (list) list.push(row);
    else queueByPosition.set(row.position, [row]);
  }
  for (const list of queueByPosition.values()) {
    list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  const cursor = new Map<string, number>();
  const slots: Slot[] = squad.players.map((player) => {
    const queue = queueByPosition.get(player.position) ?? [];
    const index = cursor.get(player.position) ?? 0;
    const registrant = queue[index] ?? null;
    cursor.set(player.position, index + 1);
    return {
      position: player.position,
      number: player.number,
      badge: player.badge,
      registrant,
      placeholder: player,
    };
  });

  const reserves: RegisteredPlayer[] = [];
  for (const [position, queue] of queueByPosition) {
    const used = cursor.get(position) ?? 0;
    reserves.push(...queue.slice(used));
  }
  reserves.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const counts: Record<string, PositionCount> = {};
  for (const slot of catalog.positionsForSport(sport)) {
    counts[slot.name] = {
      taken: (queueByPosition.get(slot.name) ?? []).length,
      capacity: catalog.maxPerPosition,
    };
  }

  return {
    slots,
    reserves,
    waitlist,
    counts,
    registered: active.length,
  };
}

export type RosterPayload = {
  registrations: RegisteredPlayer[];
  counts: Record<string, PositionCount>;
};

/**
 * Reads a team's registrations from the backend. Server-side: the relative
 * /api path only works in the browser, so this uses the same base URL the
 * rewrite points at. Any failure falls back to an empty roster, which is
 * exactly the "nobody has registered yet" state the pages already render.
 */
export async function fetchRoster(teamId: string): Promise<RosterPayload> {
  const empty: RosterPayload = { registrations: [], counts: {} };
  if (!teamId) return empty;
  try {
    const res = await fetch(
      `${API_BASE}/api/sports/registrations?teamId=${encodeURIComponent(teamId)}`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return empty;
    const data = (await res.json()) as Partial<RosterPayload>;
    return {
      registrations: Array.isArray(data.registrations) ? data.registrations : [],
      counts: data.counts && typeof data.counts === "object" ? data.counts : {},
    };
  } catch {
    return empty;
  }
}

export { playerSlug };
