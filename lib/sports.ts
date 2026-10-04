import { API_BASE } from "@/lib/config";
import type { RelateSport, RelateTeam } from "@/constants/relate";

/**
 * Sports catalogue loading.
 *
 * Teams, squads, position slots, squad sizes and the sports director all come
 * from the backend (GET /api/sports/teams) — none of it is bundled here, so
 * there are no constants to fall back to. Server code awaits getSports(),
 * which is revalidated once a minute; client components call useSports(),
 * which shares one request across every consumer on the page.
 *
 * A failure surfaces instead of hiding: getSports() throws, useSports()
 * reports an error string, and a catalogue with no teams renders the empty
 * state. The browser always uses the relative /api path, which next.config
 * rewrites to the backend so cookies stay first-party.
 */

export type { RelateSport, RelateTeam };

export type SportsDirector = {
    name: string;
    role: string;
};

export type PositionSlot = {
    /** Position name as the registration form spells it. */
    name: string;
    /** Short badge shown on an open slot (GK, CB, GS…). */
    code: string;
};

/**
 * A slot on the team sheet. Until somebody registers for the position it is a
 * placeholder: `name` is the position itself ("Goalkeeper") and `image` is
 * empty, so the card renders the position badge instead of a face.
 */
export type Player = {
    name: string;
    position: string;
    number: number;
    /** Public photo URL of the registrant — empty while the slot is open. */
    image: string;
    badge: string;
    /** True while no player has claimed the slot. */
    placeholder: boolean;
};

export type Fixture = {
    date: string;
    time: string;
    competition: string;
    opponent: string;
    venue: string;
    home: boolean;
};

export type Coach = {
    name: string;
    role: string;
};

export type Squad = {
    coach: Coach;
    players: Player[];
    fixtures: Fixture[];
};

/**
 * The catalogue for one render, with the lookups the pages need already bound
 * to it — call sites stay a single `sports.teamsForSport(...)` away from the
 * data they are reading.
 */
export type SportsData = {
    director: SportsDirector;
    sports: RelateSport[];
    teams: RelateTeam[];
    positionSlots: Record<string, PositionSlot[]>;
    squadSize: Record<string, number>;
    maxPerPosition: number;
    squads: Record<string, Squad>;
    getTeam(id: string): RelateTeam | undefined;
    teamsForSport(sport: RelateSport): RelateTeam[];
    teamsForClub(clubSlug: string): RelateTeam[];
    getSquad(teamId: string): Squad | undefined;
    /** Open slot matching a slug (an open position, e.g. "goalkeeper"). */
    findPlayer(teamId: string, slug: string): Player | undefined;
    slotsForSport(sport: RelateSport): PositionSlot[];
    /** Distinct positions in team-sheet order — the registration dropdown. */
    positionsForSport(sport: RelateSport): PositionSlot[];
    positionCode(sport: RelateSport, position: string): string;
    playerSlug(name: string): string;
};

/** URL-safe slug for a player's name (stable across server and client). */
export function playerSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/** The raw GET /api/sports/teams body — every field optional. */
type SportsPayload = {
    director?: Partial<SportsDirector>;
    sports?: unknown;
    teams?: unknown;
    positionSlots?: unknown;
    squadSize?: unknown;
    maxPerPosition?: unknown;
    squads?: unknown;
};

function isTeam(value: unknown): value is RelateTeam {
    if (!value || typeof value !== "object") return false;
    const team = value as Partial<RelateTeam>;
    return (
        typeof team.id === "string" &&
        typeof team.name === "string" &&
        typeof team.sport === "string"
    );
}

function isSlot(value: unknown): value is PositionSlot {
    if (!value || typeof value !== "object") return false;
    const slot = value as Partial<PositionSlot>;
    return typeof slot.name === "string" && typeof slot.code === "string";
}

/** Keeps well-formed rows only — a bad row should not take a page down. */
function toSquad(value: unknown): Squad | null {
    if (!value || typeof value !== "object") return null;
    const raw = value as Partial<Squad> & { coach?: Partial<Coach> };
    return {
        coach: {
            name: raw.coach?.name ?? "",
            role: raw.coach?.role ?? "",
        },
        players: Array.isArray(raw.players)
            ? (raw.players.filter(
                  (p) => p && typeof p === "object" && typeof p.name === "string",
              ) as Player[])
            : [],
        fixtures: Array.isArray(raw.fixtures)
            ? (raw.fixtures.filter(
                  (f) => f && typeof f === "object" && typeof f.date === "string",
              ) as Fixture[])
            : [],
    };
}

/** Shapes one API response (or an empty one) into the catalogue pages read. */
function toSportsData(raw: unknown): SportsData {
    const payload = (raw && typeof raw === "object" ? raw : {}) as SportsPayload;

    const teams = Array.isArray(payload.teams)
        ? payload.teams.filter(isTeam)
        : [];

    const positionSlots: Record<string, PositionSlot[]> = {};
    if (payload.positionSlots && typeof payload.positionSlots === "object") {
        for (const [sport, slots] of Object.entries(payload.positionSlots)) {
            positionSlots[sport] = Array.isArray(slots) ? slots.filter(isSlot) : [];
        }
    }

    const squadSize: Record<string, number> = {};
    if (payload.squadSize && typeof payload.squadSize === "object") {
        for (const [sport, size] of Object.entries(payload.squadSize)) {
            if (typeof size === "number") squadSize[sport] = size;
        }
    }

    const squads: Record<string, Squad> = {};
    if (payload.squads && typeof payload.squads === "object") {
        for (const [teamId, squad] of Object.entries(payload.squads)) {
            const parsed = toSquad(squad);
            if (parsed) squads[teamId] = parsed;
        }
    }

    return {
        director: {
            name: payload.director?.name ?? "",
            role: payload.director?.role ?? "",
        },
        sports: Array.isArray(payload.sports)
            ? (payload.sports.filter(
                  (s) => typeof s === "string",
              ) as RelateSport[])
            : [],
        teams,
        positionSlots,
        squadSize,
        maxPerPosition:
            typeof payload.maxPerPosition === "number"
                ? payload.maxPerPosition
                : 0,
        squads,
        getTeam: (id) => teams.find((team) => team.id === id),
        teamsForSport: (sport) => teams.filter((team) => team.sport === sport),
        teamsForClub: (clubSlug) =>
            teams.filter((team) => team.clubSlug === clubSlug),
        getSquad: (teamId) => squads[teamId],
        findPlayer: (teamId, slug) =>
            squads[teamId]?.players.find((p) => playerSlug(p.name) === slug),
        slotsForSport: (sport) => positionSlots[sport] ?? [],
        positionsForSport: (sport) => {
            const seen = new Set<string>();
            return (positionSlots[sport] ?? []).filter((slot) => {
                if (seen.has(slot.name)) return false;
                seen.add(slot.name);
                return true;
            });
        },
        positionCode: (sport, position) =>
            (positionSlots[sport] ?? []).find((slot) => slot.name === position)
                ?.code ?? "",
        playerSlug,
    };
}

/** Nothing published yet — pages render their empty state from this. */
function emptySports(): SportsData {
    return toSportsData({});
}

/**
 * The whole sports catalogue, server-side.
 *
 * Revalidated once a minute, so several reads in one render share the same
 * fetch. Throws when the backend cannot be reached or answers with anything
 * but 200/404 — callers decide how to show it, but nobody silently gets
 * substitute data. A 404 means no teams are published yet and yields an
 * empty catalogue, which is the empty state rather than a failure.
 */
export async function getSports(): Promise<SportsData> {
    const res = await fetch(`${API_BASE}/api/sports/teams`, {
        next: { revalidate: 60 },
    });
    if (res.status === 404) return emptySports();
    if (!res.ok) throw new Error(`sports api ${res.status}`);
    return toSportsData(await res.json());
}

/** One shared request for every component on the page. */
let clientRequest: Promise<SportsData> | null = null;

/**
 * One catalogue load over the relative /api path (rewritten by next.config so
 * cookies stay first-party), shared by every consumer on the page. The
 * settled promise is cached at module level and released on failure, so a
 * page load makes one request — and the next mount can retry a failed one.
 *
 * Safe to import from Server Components; client components reach it through
 * `useSports()` in `@/lib/useSports`.
 */
export function fetchClientSports(): Promise<SportsData> {
    if (!clientRequest) {
        clientRequest = fetch("/api/sports/teams", { cache: "no-store" })
            .then(async (res) => {
                if (res.status === 404) return emptySports();
                if (!res.ok) throw new Error(`sports api ${res.status}`);
                return toSportsData(await res.json());
            })
            .catch((err) => {
                // Release the request so the next mount can try again.
                clientRequest = null;
                throw err;
            });
    }
    return clientRequest;
}
