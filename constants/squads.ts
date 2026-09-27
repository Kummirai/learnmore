import {
  SPORTS_TEAMS,
  type RelateSport,
  type RelateTeam,
} from "./relate";

export const SPORTS_DIRECTOR = {
  name: "Farai Mabhena",
  role: "Sports Director",
};

export type PlayerStat = {
  label: string;
  value: string;
};

export type Player = {
  name: string;
  position: string;
  number: number;
  /** Unsplash photo id — rendered as a face-cropped headshot. */
  image: string;
  age: number;
  height: string;
  side: string;
  hometown: string;
  joined: number;
  bio: string;
  stats: PlayerStat[];
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

/* Face-cropped Unsplash portrait ids (verified working in production heroes). */
export const HEADSHOTS_MALE = [
  "photo-1506794778202-cad84cf45f1d",
  "photo-1500648767791-00dcc994a43e",
  "photo-1472099645785-5658abf4ff4e",
  "photo-1519345182560-3f2917c472ef",
  "photo-1521119989659-a83eee488004",
  "photo-1547425260-76bcadfb4f2c",
  "photo-1506277886164-e25aa3f4ef7f",
  "photo-1539571696357-5a69c17a67c6",
  "photo-1480455624313-e29b44bbfde1",
  "photo-1527980965255-d3b416303d12",
  "photo-1506157786151-b8491531f063",
  "photo-1492562080023-ab3db95bfbce",
  "photo-1463453091185-61582044d556",
  "photo-1507676184212-d03ab07a01bf",
  "photo-1519085360753-af0119f7cbe7",
  "photo-1522075469751-3a6694fb2f61",
  "photo-1511447333015-45b65e60f6d5",
  "photo-1542909168-82c3e7fdca5c",
  "photo-1568602471122-7832951cc4c5",
  "photo-1552058544-f2b08422138a",
  "photo-1564564321837-a57b7070ac4f",
  "photo-1570295999919-56ceb5ecca61",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1556157382-97eda2d62296",
  "photo-1583195764036-6dc248ac07d9",
  "photo-1493863641943-9b68992a8d07",
];

export const HEADSHOTS_FEMALE = [
  "photo-1494790108377-be9c29b29330",
  "photo-1573497019940-1c28c88b4f3e",
  "photo-1531123897727-8f129e1688ce",
  "photo-1544716278-ca5e3f4abd8c",
  "photo-1521737604893-d14cc237f11d",
  "photo-1576091160550-2173dba999ef",
  "photo-1508214751196-bcfd4ca60f91",
  "photo-1516589178581-6cd7833ae3b2",
  "photo-1544005313-94ddf0286df2",
  "photo-1580489944761-15a19d654956",
  "photo-1573496359142-b8d87734a5a2",
  "photo-1573497019236-17f8177b81e8",
  "photo-1517070208541-6ddc4d3efbcb",
  "photo-1524504388940-b1c1722653e1",
  "photo-1508341591423-4347099e1f19",
  "photo-1517841905240-472988babdf9",
  "photo-1548142813-c348350df52b",
  "photo-1534528741775-53994a69daeb",
  "photo-1567532939604-b6b5b0db2604",
  "photo-1549068106-b024baf5062d",
  "photo-1534751516642-a1af1ef26a56",
];

export const imgCard = (id: string) =>
  `https://images.unsplash.com/${id}?w=200&h=200&fit=crop&crop=face`;

export const imgDetail = (id: string) =>
  `https://images.unsplash.com/${id}?w=640&h=800&fit=crop&crop=faces`;

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

function nextRand(seed: number, i: number): number {
  const x = Math.sin(seed * 9973 + i * 1013) * 10000;
  return x - Math.floor(x);
}

const CLUB_AGE_BANDS: Partial<Record<string, [number, number]>> = {
  "sprout-kids": [6, 8],
  "sprout-tweens": [9, 11],
  "sprout-teens": [12, 15],
  surge: [16, 21],
  pulse: [21, 33],
};

const HOMETOWNS = [
  "Embalenhle",
  "Secunda",
  "eMalahleni",
  "Brakpan",
  "Springs",
  "Tembisa",
  "Daveyton",
  "Katlehong",
  "Alexandra",
  "Soweto",
  "Evander",
  "Trichardt",
  "Bethal",
  "Vosloorus",
  "Thokoza",
  "Highveld Ridge",
];

const JOINED_YEARS = [2023, 2024, 2024, 2025, 2025, 2025];

const BIO_OPENERS = [
  "Lives in {area} and joined the {squad} programme in {year}.",
  "Earned a place in the {squad} squad and trains twice a week with the team.",
  "Came through club-level football and made the jump to the {squad} squad.",
  "One of the steady hands in the {squad} dressing room since {year}.",
];

const BIO_NOTES = [
  "Favourite verse: Philippians 4:13 — “I can do all things through him who strengthens me.”",
  "Spends Saturday mornings helping the younger squad warm up.",
  "Brings energy every session and puts the team before himself.",
  "Known for calm leadership and a strong work ethic on and off the pitch.",
  "Aims to finish the season stronger than it started.",
];

function statRows(
  sport: RelateSport,
  position: string,
  age: number,
  seed: number,
  i: number,
): PlayerStat[] {
  const young = age <= 15 ? 0.5 : 1;
  const count = (base: number, spread: number) =>
    String(Math.max(0, Math.round((base + nextRand(seed, i * 9 + 1) * spread) * young)));
  const pct = () => `${Math.round(55 + nextRand(seed, i * 13 + 2) * 40)}%`;

  if (sport === "Football") {
    if (position === "Goalkeeper")
      return [
        { label: "Appearances", value: count(6, 20) },
        { label: "Clean sheets", value: count(1, 14) },
        { label: "Saves", value: count(10, 60) },
      ];
    if (position.includes("Back") || position === "Defensive Midfielder")
      return [
        { label: "Appearances", value: count(6, 20) },
        { label: "Tackles", value: count(8, 40) },
        { label: "Interceptions", value: count(5, 25) },
      ];
    return [
      { label: "Appearances", value: count(6, 20) },
      { label: "Goals", value: count(2, 22) },
      { label: "Assists", value: count(1, 15) },
    ];
  }

  if (sport === "Netball") {
    if (position.includes("Shooter"))
      return [
        { label: "Points", value: count(20, 120) },
        { label: "Feeds", value: count(30, 120) },
        { label: "Intercepts", value: count(2, 12) },
      ];
    if (position.includes("Defence") || position.includes("Keeper"))
      return [
        { label: "Intercepts", value: count(4, 20) },
        { label: "Rebounds", value: count(6, 25) },
        { label: "Turnovers", value: count(4, 18) },
      ];
    return [
      { label: "Centre passes", value: count(60, 180) },
      { label: "Feeds", value: count(20, 80) },
      { label: "Intercepts", value: count(2, 12) },
    ];
  }

  if (position === "Setter")
    return [
      { label: "Matches", value: count(4, 16) },
      { label: "Assists", value: count(30, 150) },
      { label: "Aces", value: count(2, 14) },
    ];
  if (position.includes("Blocker"))
    return [
      { label: "Matches", value: count(4, 16) },
      { label: "Blocks", value: count(4, 25) },
      { label: "Aces", value: count(2, 12) },
    ];
  if (position === "Libero")
    return [
      { label: "Matches", value: count(4, 16) },
      { label: "Digs", value: count(15, 70) },
      { label: "Passing", value: pct() },
    ];
  return [
    { label: "Matches", value: count(4, 16) },
    { label: "Kills", value: count(10, 60) },
    { label: "Aces", value: count(2, 14) },
  ];
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
  const shots = team.sport === "Netball" ? HEADSHOTS_FEMALE : HEADSHOTS_MALE;
  const bands = CLUB_AGE_BANDS[team.clubSlug] ?? [10, 18];
  const [minAge, maxAge] = bands;

  return positions.map((position, i) => {
    const name = `${pick(firstPool, seed, 7, i)} ${pick(lastPool, seed, 5, i)}`;
    const age = Math.round(minAge + nextRand(seed, i * 5 + 3) * (maxAge - minAge));
    const rawHeight =
      team.sport === "Football"
        ? 110 + age * 3.4
        : team.sport === "Netball"
          ? 115 + age * 3.0
          : 120 + age * 3.6;
    const height = Math.min(Math.max(Math.round(rawHeight / 5) * 5, 130), 200);
    const side =
      team.sport === "Netball"
        ? nextRand(seed, i * 11 + 4) < 0.5
          ? "Strong right-hand feed"
          : "Strong left-hand feed"
        : team.sport === "Volleyball"
          ? position === "Setter"
            ? "Right-hand setting"
            : nextRand(seed, i * 11 + 4) < 0.5
              ? "Right-hand hitter"
              : "Left-hand hitter"
          : position === "Goalkeeper"
            ? "Right-handed"
            : nextRand(seed, i * 11 + 4) < 0.7
              ? "Right-footed"
              : "Left-footed";
    const hometown = pick(HOMETOWNS, seed, 13, i);
    const joined = JOINED_YEARS[Math.floor(nextRand(seed, i * 17 + 5) * JOINED_YEARS.length)];
    const opener = BIO_OPENERS[Math.floor(nextRand(seed, i * 19 + 6) * BIO_OPENERS.length)]
      .replace("{area}", hometown)
      .replace("{squad}", team.name)
      .replace("{year}", String(joined));
    const note = BIO_NOTES[Math.floor(nextRand(seed, i * 23 + 7) * BIO_NOTES.length)];

    return {
      name,
      position,
      number: numbers[i],
      image: pick(shots, seed, 5, i),
      age,
      height: `${height} cm`,
      side,
      hometown,
      joined,
      bio: `${opener} ${note}`,
      stats: statRows(team.sport, position, age, seed, i),
    };
  });
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

export function findPlayer(teamId: string, slug: string): Player | undefined {
  return SQUADS[teamId]?.players.find((p) => playerSlug(p.name) === slug);
}