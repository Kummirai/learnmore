/**
 * Sprout Club: Comprehensive Honors & Badge Framework.
 *
 * Transcribed from the Sprout Club Honors framework document — the single
 * source of truth for /sprout/honors. Levels mirror the three Sprout age
 * bands; each badge sits in one track and carries its own requirements.
 * Edit here — the page reads everything from this file.
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

export type HonorBadge = {
  id: string;
  name: string;
  track: HonorTrackId;
  shape: HonorShape;
  /** How the badge looks — a patch, shield patch or lapel pin. */
  concept: string;
  requirements: string[];
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

export const HONOR_TRACKS: HonorTrack[] = [
  {
    id: "safety",
    name: "Emergency Readiness & First Aid",
    short: "Safety",
    blurb:
      "Personal details, first aid basics and the confidence to respond calmly in an emergency.",
    color: "#ef4444",
    image:
      "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=480&h=360&fit=crop&q=70",
  },
  {
    id: "finance",
    name: "Financial Literacy & Resource Management",
    short: "Money",
    blurb:
      "Needs versus wants, saving toward a goal, and how money grows over time.",
    color: "#f59e0b",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=480&h=360&fit=crop&q=70",
  },
  {
    id: "productivity",
    name: "Productivity & Digital Skills",
    short: "Digital",
    blurb:
      "Digital literacy, then Word, Excel and PowerPoint used properly — reports, budgets and pitches.",
    color: "#06b6d4",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=480&h=360&fit=crop&q=70",
  },
  {
    id: "code",
    name: "Computer Science & Programming",
    short: "Code",
    blurb:
      "From step-by-step logic and block coding to real text-based programs and websites.",
    color: "#8b5cf6",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=480&h=360&fit=crop&q=70",
  },
  {
    id: "media",
    name: "Journalism, Photography & Video",
    short: "Media",
    blurb:
      "Storytelling with a camera and a byline — with the ethics to match.",
    color: "#ec4899",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=480&h=360&fit=crop&q=70",
    teensOnly: true,
  },
];

export const HONOR_LEVELS: HonorLevel[] = [
  {
    id: "kids",
    levelNumber: 1,
    name: "Sprout Kids",
    ageBand: "Ages 6 – 8",
    focus:
      "Foundational safety, basic money choices, early computer interaction and visual logic.",
    color: "#66BB6A",
    colorDark: "#388E3C",
    clubSlug: "sprout-kids",
    badges: [
      {
        id: "life-saver",
        name: "Life Saver Badge",
        track: "safety",
        shape: "patch",
        concept: "Circular patch featuring a red cross or life ring icon.",
        requirements: [
          "Personal information: memorise your full home address, emergency contacts and parents' full names.",
          "Basic care: demonstrate cleaning a minor scrape, applying antiseptic ointment and neatly placing an adhesive bandage.",
          "Emergency call: roleplay calling emergency services, clearly stating name, location and scenario without panicking.",
        ],
      },
      {
        id: "smart-saver",
        name: "Smart Saver Badge",
        track: "finance",
        shape: "patch",
        concept: "Circular patch featuring a piggy bank or coin icon.",
        requirements: [
          'Budget game: complete the "Penny Market" exercise by selecting craft supplies while staying under a fixed coin limit.',
          "Needs vs. wants: accurately categorise household items into needs (water, food, warm clothes) and wants (toys, treats, video games).",
          "Savings goal: decorate a personal saving jar and log savings weekly toward a small goal over three weeks.",
        ],
      },
      {
        id: "digital-explorer",
        name: "Digital Explorer Badge",
        track: "productivity",
        shape: "patch",
        concept: "Circular patch featuring a monitor and keyboard icon.",
        requirements: [
          "Hardware & ergonomics: identify screen, keyboard, mouse and power button, and demonstrate safe posture at a computer station.",
          "Word processing: open Microsoft Word, type a three-sentence story and apply formatting (bold, font size and text colour).",
          "File handling: save a file into a designated folder with a standard file name and properly shut down the computer.",
        ],
      },
      {
        id: "logic-builder",
        name: "Logic Builder Badge",
        track: "code",
        shape: "patch",
        concept: "Circular patch featuring interlocking puzzle pieces.",
        requirements: [
          'Physical algorithms: guide a peer through a physical path using step-by-step commands ("step forward 2", "turn right").',
          "Visual block coding: complete five beginner coding puzzles on ScratchJr or Code.org.",
          "Pattern recognition: identify and extend three repeating logic sequences.",
        ],
      },
    ],
  },
  {
    id: "tweens",
    levelNumber: 2,
    name: "Sprout Tweens",
    ageBand: "Ages 9 – 11",
    focus:
      "Intermediate care skills, comparative budgeting, document creation and visual game design.",
    color: "#4CAF50",
    colorDark: "#2E7D32",
    clubSlug: "sprout-tweens",
    badges: [
      {
        id: "life-saver-specialist",
        name: "Life Saver Specialist",
        track: "safety",
        shape: "shield",
        concept: "Shield-shaped patch with a first-aid medical cross.",
        requirements: [
          "Hazard response: explain proper treatment steps for minor burns, insect stings and nosebleeds.",
          "Recovery position: safely place a peer into the recovery position and check for clear breathing.",
          "First aid kit: assemble a functioning personal or backpack first-aid kit containing essential supplies.",
        ],
      },
      {
        id: "smart-saver-master",
        name: "Smart Saver Master",
        track: "finance",
        shape: "shield",
        concept: "Shield-shaped patch with a balance scale or chart icon.",
        requirements: [
          "Menu budgeting: plan a balanced meal menu for a group on a set budget, comparing unit prices across brands.",
          "Income & expense log: maintain a two-week personal balance sheet logging allowance or chores against savings and spending.",
          "Bank basics: explain the concept of bank interest and how money grows over time in a savings account.",
        ],
      },
      {
        id: "office-specialist",
        name: "Office Specialist Badge",
        track: "productivity",
        shape: "shield",
        concept:
          "Shield-shaped patch with document, spreadsheet and presentation symbols.",
        requirements: [
          "Microsoft Word: design a one-page report with a centred title, sub-headers, a bulleted list and an inline image.",
          "Microsoft Excel: create a five-item budget or inventory sheet using standard formulas (=SUM, =AVERAGE) and currency formatting.",
          "Microsoft PowerPoint: construct a four-slide presentation on a topic, incorporating slide transitions and title formatting.",
        ],
      },
      {
        id: "code-creator",
        name: "Code Creator Badge",
        track: "code",
        shape: "shield",
        concept: "Shield-shaped patch featuring a game controller icon.",
        requirements: [
          "Game development: build a 2D game in Scratch using events, loops (if-then), variables (score) and custom audio.",
          "Debugging: identify and correct at least three logical errors in a broken pre-made program.",
          "Presentation: present the completed project to the group and explain how the underlying code blocks work.",
        ],
      },
    ],
  },
  {
    id: "teens",
    levelNumber: 3,
    name: "Sprout Teens",
    ageBand: "Ages 12 – 15",
    focus:
      "Crisis management, event budget planning, professional documentation and text-based coding.",
    color: "#43A047",
    colorDark: "#1B5E20",
    clubSlug: "sprout-teens",
    badges: [
      {
        id: "first-responder",
        name: "First Responder Honor",
        track: "safety",
        shape: "pin",
        concept: "Metal lapel pin or woven sash ribbon with a crest emblem.",
        requirements: [
          "Certifications: practise basic CPR/AED routines and choking intervention (Heimlich manoeuvre) under qualified instruction.",
          "Event safety: serve as a designated safety officer during a Sprout Camp or Sprout Sports outing.",
          "Safety briefing: prepare and deliver a five-minute safety orientation for younger Sprout Club members.",
        ],
      },
      {
        id: "financial-strategist",
        name: "Financial Strategist Honor",
        track: "finance",
        shape: "pin",
        concept: "Metal lapel pin or woven sash ribbon with a growth graph icon.",
        requirements: [
          "Event financial plan: build a full expense budget for a real group trip or fundraiser, projecting revenue versus costs.",
          "Financial literacy: research and explain checking accounts, debit/credit cards, credit scores and compound interest.",
          "Fundraising drive: organise and execute a mini community project or fundraiser from budget setup through final audit.",
        ],
      },
      {
        id: "productivity-master",
        name: "Productivity Master Honor",
        track: "productivity",
        shape: "pin",
        concept: "Metal lapel pin or woven sash ribbon with a briefcase symbol.",
        requirements: [
          "Microsoft Word: write a multi-page formal document with an automated table of contents, headers, footers and page numbers.",
          "Microsoft Excel: build a project financial tracker with conditional formatting, logic functions (IF, COUNTIF) and summary charts.",
          "Microsoft PowerPoint: deliver a six-slide proposal pitch deck with custom slide templates, embedded media and transition timings.",
        ],
      },
      {
        id: "software-engineer",
        name: "Software Engineer Honor",
        track: "code",
        shape: "pin",
        concept: "Metal lapel pin or woven sash ribbon with code brackets (</>).",
        requirements: [
          "Text syntax: write a functional program in Python or JavaScript that takes user input, uses loops/conditionals and returns calculated results.",
          "Web basics: code a single-page HTML/CSS website with styled text, structured sections and external links.",
          "Code documentation: document source code clearly with inline comments explaining logic flow and structure.",
        ],
      },
      {
        id: "media-communications",
        name: "Media & Communications Honor",
        track: "media",
        shape: "pin",
        concept: "Metal lapel pin or woven sash ribbon featuring a camera/microphone symbol.",
        requirements: [
          "Content creation: produce a two-minute promotional video or written newsletter covering a Sprout Club event (such as Sprout Camp or Sprout Sports).",
          "Interviewing: conduct a structured five-question interview with a leader or peer and edit it into a clear report.",
          "Media ethics: present key rules on digital privacy, copyright and respectful media representation.",
        ],
      },
    ],
  },
];

export const HONOR_TRACK_BY_ID = Object.fromEntries(
  HONOR_TRACKS.map((t) => [t.id, t]),
) as Record<HonorTrackId, HonorTrack>;

/** The level whose age band a Sprout sub-club page shows (e.g. sprout-kids). */
export function honorLevelForClub(clubSlug: string): HonorLevel | undefined {
  return HONOR_LEVELS.find((l) => l.clubSlug === clubSlug);
}

export const HONOR_COUNT = HONOR_LEVELS.reduce(
  (sum, level) => sum + level.badges.length,
  0,
);

export const SHAPE_LABEL: Record<HonorShape, string> = {
  patch: "Circular patch",
  shield: "Shield patch",
  pin: "Lapel pin",
};

/** The overview matrix: one cell per level × track (null when not offered). */
export function honorMatrix(): (HonorBadge | null)[][] {
  return HONOR_LEVELS.map((level) =>
    HONOR_TRACKS.map(
      (track) =>
        level.badges.find((b) => b.track === track.id) ?? null,
    ),
  );
}
