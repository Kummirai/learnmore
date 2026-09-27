import {
  SPORTS_TEAMS,
  type RelateSport,
  type RelateTeam,
} from "./relate";

export const SPORTS_DIRECTOR = {
  name: "Farai Mabhena",
  role: "Sports Director",
};

export type PositionSlot = {
  /** Position name as the registration form spells it. */
  name: string;
  /** Short badge shown on an open slot (GK, CB, GS…). */
  code: string;
};

/**
 * One entry per slot on the team sheet — some positions field two players
 * (two Centre Backs, two Outside Hitters…).
 *
 * Mirrors `lib/sports-positions.ts` in the backend: the API validates a
 * submitted position against its own copy of this list.
 */
export const POSITION_SLOTS: Record<RelateSport, PositionSlot[]> = {
  Football: [
    { name: "Goalkeeper", code: "GK" },
    { name: "Right Back", code: "RB" },
    { name: "Centre Back", code: "CB" },
    { name: "Centre Back", code: "CB" },
    { name: "Left Back", code: "LB" },
    { name: "Defensive Midfielder", code: "DM" },
    { name: "Central Midfielder", code: "CM" },
    { name: "Attacking Midfielder", code: "AM" },
    { name: "Right Winger", code: "RW" },
    { name: "Striker", code: "ST" },
    { name: "Left Winger", code: "LW" },
  ],
  Netball: [
    { name: "Goal Shooter", code: "GS" },
    { name: "Goal Attack", code: "GA" },
    { name: "Wing Attack", code: "WA" },
    { name: "Centre", code: "C" },
    { name: "Wing Defence", code: "WD" },
    { name: "Goal Defence", code: "GD" },
    { name: "Goal Keeper", code: "GK" },
  ],
  Volleyball: [
    { name: "Setter", code: "S" },
    { name: "Outside Hitter", code: "OH" },
    { name: "Outside Hitter", code: "OH" },
    { name: "Middle Blocker", code: "MB" },
    { name: "Middle Blocker", code: "MB" },
    { name: "Opposite Hitter", code: "OPP" },
    { name: "Libero", code: "L" },
  ],
};

/** How many registrants a position holds per squad: starter plus depth. */
export const MAX_PER_POSITION = 3;

/** Slots on the team sheet — the first applicants make these up. */
export const SQUAD_SIZE: Record<RelateSport, number> = {
  Football: 11,
  Netball: 7,
  Volleyball: 7,
};

export function slotsForSport(sport: RelateSport): PositionSlot[] {
  return POSITION_SLOTS[sport] ?? [];
}

/** Distinct positions in team-sheet order — the registration dropdown. */
export function positionsForSport(sport: RelateSport): PositionSlot[] {
  const seen = new Set<string>();
  return slotsForSport(sport).filter((slot) => {
    if (seen.has(slot.name)) return false;
    seen.add(slot.name);
    return true;
  });
}

export function positionCode(sport: RelateSport, position: string): string {
  return slotsForSport(sport).find((slot) => slot.name === position)?.code ?? "";
}

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

const FOOTBALL_NUMBERS = [1, 2, 3, 4, 5, 6, 8, 10, 7, 9, 11];

const OPPONENTS: Record<RelateSport, string[]> = {
  Football: [
    "Highfield Rovers",
    "Mbabane Youth",
    "Kings College XI",
    "Brothers FC",
    "Township Stars",
    "Riverside Athletic",
  ],
  Netball: [
    "Highfield Stars",
    "Mbabane Cougars",
    "Kings College",
    "Valley Sparks",
    "Township Fire",
    "Riverside Gems",
  ],
  Volleyball: [
    "Highfield Spikers",
    "Mbabane Blue",
    "Kings College",
    "Valley Rise",
    "Township Ace",
    "Riverside Setters",
  ],
};

const AWAY_VENUES: Record<RelateSport, string> = {
  Football: "Opposition Grounds",
  Netball: "Opposition Courts",
  Volleyball: "Opposition Hall",
};

const KICKOFF: Partial<Record<string, string>> = {
  "sprout-kids": "09:00",
  "sprout-tweens": "10:30",
  "sprout-teens": "14:00",
  surge: "15:00",
  pulse: "16:00",
};

const LEAGUES: Record<RelateSport, string> = {
  Football: "Relate Youth League",
  Netball: "Relate Netball League",
  Volleyball: "Relate Volleyball League",
};

function buildPlayers(team: RelateTeam): Player[] {
  const slots = slotsForSport(team.sport);
  const numbers =
    team.sport === "Football"
      ? FOOTBALL_NUMBERS
      : slots.map((_, i) => (team.sport === "Volleyball" && i === 6 ? 15 : i + 1));

  return slots.map((slot, i) => ({
    name: slot.name,
    position: slot.name,
    number: numbers[i],
    image: "",
    badge: slot.code,
    placeholder: true,
  }));
}

/** URL-safe slug for a player's name (stable for static generation). */
export function playerSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildFixtures(team: RelateTeam, idx: number): Fixture[] {
  const opponents = OPPONENTS[team.sport];
  const time = KICKOFF[team.clubSlug] ?? "14:00";
  const base = new Date("2026-10-03T00:00:00");

  return Array.from({ length: 5 }).map((_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i * 7);
    const home = i % 2 === 0;
    return {
      date: date.toISOString().slice(0, 10),
      time,
      competition: i === 2 ? "Spring 2026 Tournament" : LEAGUES[team.sport],
      opponent: opponents[(idx + i * 3) % opponents.length],
      venue: home ? "Relate Grounds" : AWAY_VENUES[team.sport],
      home,
    };
  });
}

const COACH_NAMES: Record<string, string> = {
  "sk-fc": "Tendai Zhou",
  "stw-fc": "Rudo Gumbo",
  "ste-fc": "Kudzai Moyo",
  "surge-fc": "Musa Ndlovu",
  "pulse-fc": "Sandile Mahlangu",
  "sk-netball": "Chipo Sibanda",
  "stw-netball": "Nomsa Dube",
  "ste-netball": "Zanele Khumalo",
  "surge-netball": "Ayanda Ngcobo",
  "pulse-netball": "Palesa Molefe",
  "surge-volleyball": "Lwazi Mavuso",
  "pulse-volleyball": "Nkosinathi Dlamini",
};

export const SQUADS: Record<string, Squad> = Object.fromEntries(
  SPORTS_TEAMS.map((team, idx) => [
    team.id,
    {
      coach: {
        name: COACH_NAMES[team.id] ?? `${team.initials} Coach`,
        role: "Head Coach",
      },
      players: buildPlayers(team),
      fixtures: buildFixtures(team, idx),
    },
  ]),
);

export function getSquad(teamId: string): Squad | undefined {
  return SQUADS[teamId];
}

/** Open slot matching a slug (an open position, e.g. "goalkeeper"). */
export function findPlayer(teamId: string, slug: string): Player | undefined {
  return SQUADS[teamId]?.players.find((p) => playerSlug(p.name) === slug);
}
