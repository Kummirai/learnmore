import {
  SPORTS_TEAMS,
  type RelateSport,
  type RelateTeam,
} from "./relate";

export const SPORTS_DIRECTOR = {
  name: "Farai Mabhena",
  role: "Sports Director",
};

export type Player = {
  name: string;
  position: string;
  number: number;
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

const FOOTBALL_POSITIONS = [
  "Goalkeeper",
  "Right Back",
  "Centre Back",
  "Centre Back",
  "Left Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Winger",
  "Striker",
  "Left Winger",
];

const FOOTBALL_NUMBERS = [1, 2, 3, 4, 5, 6, 8, 10, 7, 9, 11];

const NETBALL_POSITIONS = [
  "Goal Shooter",
  "Goal Attack",
  "Wing Attack",
  "Centre",
  "Wing Defence",
  "Goal Defence",
  "Goal Keeper",
];

const VOLLEYBALL_POSITIONS = [
  "Setter",
  "Outside Hitter",
  "Outside Hitter",
  "Middle Blocker",
  "Middle Blocker",
  "Opposite Hitter",
  "Libero",
];

const MALE_FIRST = [
  "Thabo",
  "Sipho",
  "Musa",
  "Mandla",
  "Bongani",
  "Thulani",
  "Kagiso",
  "Sizwe",
  "Lwazi",
  "Ayanda",
  "Thapelo",
  "Lindokuhle",
  "Mpho",
  "Katlego",
  "Tshepo",
  "Wandile",
  "Sfiso",
  "Nkosinathi",
];

const MALE_LAST = [
  "Mokoena",
  "Ndlovu",
  "Dlamini",
  "Khumalo",
  "Mthembu",
  "Nkosi",
  "Zulu",
  "Ngcobo",
  "Gumbi",
  "Sibisi",
  "Mabena",
  "Masango",
  "Mahlangu",
  "Selepe",
  "Mofokeng",
  "Moeketsi",
  "Ntuli",
  "Mavuso",
];

const FEMALE_FIRST = [
  "Zanele",
  "Nomsa",
  "Thandiwe",
  "Lerato",
  "Chipo",
  "Rudo",
  "Palesa",
  "Nokuthula",
  "Busisiwe",
  "Thandeka",
  "Nobuhle",
  "Siphiwe",
  "Lindelwa",
  "Vuyo",
  "Asanda",
  "Naledi",
  "Zandile",
  "Ayanda",
];

const FEMALE_LAST = [
  "Ncube",
  "Dube",
  "Sibanda",
  "Moyo",
  "Khumalo",
  "Gumede",
  "Ngwane",
  "Ndlovu",
  "Molefe",
  "Dlamini",
  "Mthembu",
  "Zulu",
  "Nkosi",
  "Mabaso",
  "Tshabalala",
  "Mokoena",
  "Maseko",
  "Sithole",
];

const OPPONENTS: Record<RelateSport, string[]> = {
  Football: [
    "Ekurhuleni United",
    "Randridge Rangers",
    "Embalenhle Stars",
    "Secunda City",
    "Springs Warriors",
    "Brakpan All Stars",
  ],
  Netball: [
    "Ekurhuleni Diamonds",
    "Springs Pulse",
    "Vaal Queens",
    "Embalenhle Angels",
    "Brakpan Netball Club",
    "Ridge Ravens",
  ],
  Volleyball: [
    "Secunda Spikers",
    "Randridge Vipers",
    "Comet Volleyball",
    "Embalenhle Eagles",
    "Ekurhuleni Smash",
    "Dawn Trojans",
  ],
};

const AWAY_VENUES: Record<RelateSport, string> = {
  Football: "Veldview Stadium",
  Netball: "Ridge Pavilion",
  Volleyball: "Embalenhle Sports Hall",
};

const KICKOFF: Partial<Record<string, string>> = {
  "sprout-kids": "09:00",
  "sprout-tweens": "10:30",
  "sprout-teens": "12:00",
  surge: "14:00",
  pulse: "19:30",
};

const LEAGUES: Record<RelateSport, string> = {
  Football: "Relate Football League",
  Netball: "Relate Netball League",
  Volleyball: "Relate Volleyball League",
};

function seedFromKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick(pool: string[], seed: number, stride: number, i: number): string {
  return pool[(seed + i * stride) % pool.length];
}

function buildPlayers(team: RelateTeam): Player[] {
  const seed = seedFromKey(team.id);
  const positions =
    team.sport === "Football"
      ? FOOTBALL_POSITIONS
      : team.sport === "Netball"
        ? NETBALL_POSITIONS
        : VOLLEYBALL_POSITIONS;
  const numbers =
    team.sport === "Football"
      ? FOOTBALL_NUMBERS
      : positions.map((_, i) => (i === 6 && team.sport === "Volleyball" ? 15 : i + 1));
  const firstPool = team.sport === "Netball" ? FEMALE_FIRST : MALE_FIRST;
  const lastPool = team.sport === "Netball" ? FEMALE_LAST : MALE_LAST;

  return positions.map((position, i) => ({
    name: `${pick(firstPool, seed, 7, i)} ${pick(lastPool, seed, 9, i)}`,
    position,
    number: numbers[i],
  }));
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
  "sk-volleyball": "Sipho Ndlovu",
  "stw-volleyball": "Kagiso Moeketsi",
  "ste-volleyball": "Thabo Selepe",
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