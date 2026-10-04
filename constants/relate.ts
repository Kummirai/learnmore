/** The three-pillar framework every club above Sprout is built on. */
export type RelatePillar = "Shift" | "Sanctuary" | "Connect";

export const PILLARS: RelatePillar[] = ["Shift", "Sanctuary", "Connect"];

export type RelateProgram = {
  name: string;
  blurb: string;
  detail: string;
  /** Which pillar the program sits under. Sprout programs stay ungrouped. */
  pillar?: RelatePillar;
};

export type RelateClub = {
  slug: string;
  name: string;
  group: string;
  ageRange: string;
  tagline: string;
  description: string;
  heroImage: string;
  color: string;
  colorDark: string;
  whatsappGroupLink: string;
  programs: RelateProgram[];
  parentSlug?: string;
  mission?: string;
  vision?: string;
  /** Club-specific name for each pillar (e.g. Surge's Shift pillar = "Runway"). */
  pillarLabels?: Record<RelatePillar, string>;
};

export const CLUBS: RelateClub[] = [
  {
    slug: "sprout",
    name: "Sprout",
    group: "Children",
    ageRange: "6 – 15 yrs",
    tagline: "Growing strong, reaching high.",
    description:
      "Children in their formative years — needing nurturing, guidance, education support and a safe environment to grow.",
    heroImage: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80",
    color: "#4CAF50",
    colorDark: "#2E7D32",
    whatsappGroupLink: "https://chat.whatsapp.com/DdZ3vBcZtfLCuoS9BqEL6n",
    programs: [
      {
        name: "Sprout Club",
        blurb: "Weekly children's activities: games, crafts and stories.",
        detail:
          "Every Saturday morning children gather for games, crafts, music and stories that build character and confidence. Volunteers lead small groups by age so every child is known and celebrated.",
      },
      {
        name: "Sprout Camp",
        blurb: "Weekend or holiday camps — low-cost.",
        detail:
          "An overnight camp experience with hikes, campfires and team challenges, subsidised so every child can attend.",
      },
      {
        name: "Sprout Sports",
        blurb: "Weekend sports and recreation.",
        detail:
          "Fun weekend sport sessions — soccer, netball and movement games — where children learn teamwork and stay active.",
      },
    ],
  },
  {
    slug: "surge",
    name: "Surge",
    group: "Young Youth",
    ageRange: "16 – 21 yrs",
    tagline: "Rise. Build. Become.",
    description:
      "Young people stepping into adulthood — needing guidance, skills and purpose.",
    mission:
      "To empower teenagers and young adults with foundational identity, essential life skills, and academic support to successfully transition into independent adulthood.",
    vision:
      "A generation of confident, purpose-driven young leaders securely anchored in their faith and practically equipped for the future marketplace.",
    heroImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
    color: "#FF6B00",
    colorDark: "#C2410C",
    whatsappGroupLink: "https://chat.whatsapp.com/Fkq2vBcZtfLCuoS9CqGM7o",
    pillarLabels: {
      Shift: "Runway",
      Sanctuary: "Identity",
      Connect: "Fun & Action",
    },
    programs: [
      {
        name: "The Launch Pad",
        blurb: "Career exposure, internships and job placements.",
        detail:
          "Work-shadow days, internship placements and CV clinics that open doors into the working world.",
        pillar: "Shift",
      },
      {
        name: "Life Skills Workshops",
        blurb: "Finance, CV writing and interview prep.",
        detail:
          "Hands-on workshops — open your first bank account, write a CV that gets read, and nail the interview.",
        pillar: "Shift",
      },
      {
        name: "Tuition Support",
        blurb: "School and university fees.",
        detail:
          "Registration and tuition support for students who qualify, based on need and school reports.",
        pillar: "Shift",
      },
      {
        name: "School Supply Drive",
        blurb: "Stationery, uniforms and books.",
        detail:
          "Annual drive collecting packs of stationery, uniforms and set-work books before each school year starts.",
        pillar: "Shift",
      },
      {
        name: "Surge Fire",
        blurb: "Youth worship nights.",
        detail:
          "Monthly worship nights with music, testimony and prayer — optional and open to everyone.",
        pillar: "Sanctuary",
      },
      {
        name: "Purpose Quest",
        blurb: "Identity and calling workshops.",
        detail:
          "A guided journey through identity, gifts and calling to help you find your purpose.",
        pillar: "Sanctuary",
      },
      {
        name: "Surge Outings",
        blurb: "Park visits and beach days.",
        detail:
          "Regular outings to parks, the beach and local attractions — friendship and fresh air.",
        pillar: "Connect",
      },
      {
        name: "Impact Squad",
        blurb: "Local volunteering and community service.",
        detail:
          "Serve alongside your crew on local projects — food drives, clean-ups and outreach in the neighbourhood.",
        pillar: "Connect",
      },
    ],
  },
  {
    slug: "pulse",
    name: "Pulse",
    group: "Youth",
    ageRange: "21–33 yrs",
    tagline: "Live loud. Move forward.",
    description:
      "Young adults building careers, finances and identity — needing network and direction.",
    mission:
      "To equip young professionals and entrepreneurs with cutting-edge marketplace tools, long-term financial mastery, deep accountability networks, and an active marketplace calling.",
    vision:
      "A thriving network of young adults driving economic innovation and spiritual transformation within their specific corporate and civic industries.",
    heroImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80",
    color: "#00B4D8",
    colorDark: "#0284C7",
    whatsappGroupLink: "https://chat.whatsapp.com/Glr3wCdZugMDvpT9DrHN8p",
    pillarLabels: {
      Shift: "Acceleration",
      Sanctuary: "Wellness",
      Connect: "Fellowship",
    },
    programs: [
      {
        name: "The Hustle Hub",
        blurb: "Co-working and entrepreneurship incubator.",
        detail:
          "Free co-working days plus a 12-week incubator for young businesses — mentorship, templates and pitch practice.",
        pillar: "Shift",
      },
      {
        name: "Pulse Wallet",
        blurb: "Financial literacy: budgeting, investing, credit.",
        detail:
          "A practical money course: budgeting that works, debt and credit scores, and first steps into investing.",
        pillar: "Shift",
      },
      {
        name: "Career Workshops",
        blurb: "CV writing, interviews and career planning.",
        detail:
          "Bring your CV, leave with a plan — writing labs, mock interviews and career mapping sessions.",
        pillar: "Shift",
      },
      {
        name: "Tuition & Study Grants",
        blurb: "Support for further education.",
        detail:
          "Short-course and further-study grants awarded each term based on need and a simple application.",
        pillar: "Shift",
      },
      {
        name: "Pulse Faith",
        blurb: "Prayer groups and Bible study.",
        detail:
          "Optional weekly prayer groups and Bible studies for those who want to grow spiritually.",
        pillar: "Sanctuary",
      },
      {
        name: "Pulse Check",
        blurb: "Mental health and burnout circles.",
        detail:
          "Confidential peer circles facilitated by trained volunteers — because your mind matters as much as your money.",
        pillar: "Sanctuary",
      },
      {
        name: "Social Mixers",
        blurb: "Potlucks and park braais.",
        detail:
          "Relaxed potlucks, park braais and game evenings — community without the pressure.",
        pillar: "Connect",
      },
      {
        name: "Purpose in Action",
        blurb: "Project-based community impact.",
        detail:
          "Team up with your crew on a local project each quarter — plan it, run it and see the difference it makes.",
        pillar: "Connect",
      },
    ],
  },
  {
    slug: "prime",
    name: "Prime",
    group: "Singles (No Kids)",
    ageRange: "33+ yrs",
    tagline: "Own your stage. Flourish.",
    description:
      "Mature singles thriving independently — needing community and purpose.",
    mission:
      "To provide mature single adults with premium spaces for advanced career pivot planning, deep theological sanctuary, exceptional lifestyle networks, and multi-generational mentorship paths.",
    vision:
      "A leadership powerhouse of mature single professionals living integrated, influential lives while actively funding and mentoring the next generation.",
    heroImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80",
    color: "#6C2BD9",
    colorDark: "#4A148C",
    whatsappGroupLink: "https://chat.whatsapp.com/Hms4xDeZvhNEwqU9EsIO9q",
    pillarLabels: {
      Shift: "Optimization",
      Sanctuary: "Depth",
      Connect: "Premium",
    },
    programs: [
      {
        name: "Prime Pursuit",
        blurb: "Career reinvention and skill-building.",
        detail:
          "Structured programmes for career pivots — new skills, new industries, new confidence.",
        pillar: "Shift",
      },
      {
        name: "Career Transition Help",
        blurb: "Job search and side hustle deployment.",
        detail:
          "Practical help with job searches and getting a side hustle off the ground — from idea to first income.",
        pillar: "Shift",
      },
      {
        name: "Retirement & Estate Planning",
        blurb: "Retirement income and estate planning.",
        detail:
          "Plan a dignified retirement and put an estate in order — wills, beneficiaries and wealth that outlives you.",
        pillar: "Shift",
      },
      {
        name: "Prime Reflection",
        blurb: "Life review and spiritual retreats.",
        detail:
          "Optional guided retreats to review the story so far and set direction for what's next.",
        pillar: "Sanctuary",
      },
      {
        name: "Prayer Shield",
        blurb: "Intercessory prayer teams.",
        detail:
          "Optional teams that pray weekly for members' needs and celebrate answered prayer.",
        pillar: "Sanctuary",
      },
      {
        name: "Crisis Support",
        blurb: "Localised immediate help, case by case.",
        detail:
          "When life happens — emergency financial, food or counselling support assessed case by case.",
        pillar: "Sanctuary",
      },
      {
        name: "Prime Outings",
        blurb: "Scenic hikes, vineyard lunches and weekend escapes.",
        detail:
          "Curated day outings and weekend escapes — scenic hikes, vineyard lunches and time away from the routine.",
        pillar: "Connect",
      },
      {
        name: "Legacy Lab",
        blurb: "Mentorship training to give back to younger groups.",
        detail:
          "Become a trained mentor to Surge and Pulse members — turn your experience into someone else's shortcut.",
        pillar: "Connect",
      },
      {
        name: "Elders' Table",
        blurb: "Wisdom-sharing sessions.",
        detail:
          "Quarterly dinners where stories and wisdom are passed between generations.",
        pillar: "Connect",
      },
    ],
  },
  {
    slug: "anchor",
    name: "Anchor",
    group: "Single Parents",
    ageRange: "Parenting but single",
    tagline: "Holding it all together.",
    description:
      "Single parents raising children alone — needing support, community and practical help.",
    mission:
      "To alleviate economic stress, cultivate deep personal restoration, and form healthy mutual-aid networks that stabilize whole homes.",
    vision:
      "A community where single parents transition from surviving to thriving, raising whole families while fulfilling their career and spiritual callings.",
    heroImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&q=80",
    color: "#2E7D32",
    colorDark: "#14532D",
    whatsappGroupLink: "https://chat.whatsapp.com/Int5yEfZwiOFxrV9FtJP0r",
    pillarLabels: {
      Shift: "Resilience",
      Sanctuary: "Restoration",
      Connect: "Community",
    },
    programs: [
      {
        name: "Single-Income Wealth",
        blurb: "Budgeting, debt elimination and property investing.",
        detail:
          "Build a money structure that works on one income — a budget, a debt-elimination plan and a first step into property.",
        pillar: "Shift",
      },
      {
        name: "Childcare & Tuition Grants",
        blurb: "Childcare, school fees and study support.",
        detail:
          "Grants toward childcare, school fees and uniforms so money never decides whether your child gets to learn.",
        pillar: "Shift",
      },
      {
        name: "Flexible Career Path",
        blurb: "Career progression built around family life.",
        detail:
          "Coaching on hours, roles and study options that move your career forward without breaking the family rhythm.",
        pillar: "Shift",
      },
      {
        name: "Restoration Circles",
        blurb: "Co-parenting limits, burnout care and identity tracking.",
        detail:
          "Small groups that hold the hard parts — co-parenting boundaries, burnout care and remembering who you are.",
        pillar: "Sanctuary",
      },
      {
        name: "Shield of Grace",
        blurb: "Parent fellowship and prayer.",
        detail:
          "A parent fellowship that prays for one another and shows up with a meal or a hand when a week goes sideways.",
        pillar: "Sanctuary",
      },
      {
        name: "Emergency Cash Relief",
        blurb: "Rapid help when a month goes wrong.",
        detail:
          "Fast, dignified cash relief for the emergencies that would otherwise blow up the whole month.",
        pillar: "Sanctuary",
      },
      {
        name: "Parent & Child Outings",
        blurb: "Curated outings for parents and children.",
        detail:
          "Subsidised days out where you can simply enjoy your kids — memory-making without the cost.",
        pillar: "Connect",
      },
      {
        name: "Weekend Family Escapes",
        blurb: "Restorative weekends with childcare built in.",
        detail:
          "Restorative weekend getaways with a childcare grid built in, so parents actually get to rest.",
        pillar: "Connect",
      },
      {
        name: "Resource Swap",
        blurb: "Uniform and clothing exchange database.",
        detail:
          "A cooperative database for swapping uniforms and outgrown clothing — what your child has outgrown, another family needs.",
        pillar: "Connect",
      },
    ],
  },
  {
    slug: "spark",
    name: "Spark",
    group: "Couples (0–5 Years Married)",
    ageRange: "0 – 5 yrs married",
    tagline: "Lay it right from day one.",
    description:
      "Newly married couples building the foundations — needing unity, tools and each other.",
    mission:
      "To anchor newly married couples with unified financial blueprints, foundational communication tools, and Christ-centered relational habits to construct an unshakeable marital bedrock.",
    vision:
      "A generation of newly married teams navigating unified asset creation and deep emotional alignment, serving as an unshakeable nucleus for their future children.",
    heroImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=80",
    color: "#E8A2B6",
    colorDark: "#9D174D",
    whatsappGroupLink: "https://chat.whatsapp.com/Jot6zFgZxkPGysW9GuKQ1s",
    pillarLabels: {
      Shift: "Foundation",
      Sanctuary: "Alignment",
      Connect: "Connection",
    },
    programs: [
      {
        name: "Joint Financial Visioning",
        blurb: "One shared money vision for two lives.",
        detail:
          "Sit down together and build the shared money plan — income, goals and the first assets you create as a team.",
        pillar: "Shift",
      },
      {
        name: "First Home Blueprint",
        blurb: "First-home buying and asset strategies.",
        detail:
          "From deposit to handover — strategies for buying your first home and getting the asset column started.",
        pillar: "Shift",
      },
      {
        name: "Dual-Career Charting",
        blurb: "Unified dual-career path planning.",
        detail:
          "Chart both careers on one timeline — study, moves, timing and the trade-offs you agree on early.",
        pillar: "Shift",
      },
      {
        name: "Intimacy Preservation Circles",
        blurb: "Protecting closeness in the early years.",
        detail:
          "Small circles where couples talk honestly about staying close through work, money and in-law pressure.",
        pillar: "Sanctuary",
      },
      {
        name: "Conflict Labs",
        blurb: "Communication and conflict resolution practice.",
        detail:
          "Practical labs for fair fighting — how to disagree, repair and come back to the same side.",
        pillar: "Sanctuary",
      },
      {
        name: "Couples Devotionals",
        blurb: "Intentional devotional rhythms for two.",
        detail:
          "Simple rhythms for praying and reading together that survive real weeks, not just ideal ones.",
        pillar: "Sanctuary",
      },
      {
        name: "Double-Date Socials",
        blurb: "High-energy couple socials.",
        detail:
          "Double dates, game nights and socials where you make couple-friends who are walking the same road.",
        pillar: "Connect",
      },
      {
        name: "Young Couples' Getaways",
        blurb: "Weekend escapes for two.",
        detail:
          "Affordable weekend getaways built for young couples — time away before life gets louder.",
        pillar: "Connect",
      },
      {
        name: "Babysitting Swap",
        blurb: "Date night through a mutual swap network.",
        detail:
          "Swap sitters with other couples in the club so date night keeps happening — no cost, no guilt.",
        pillar: "Connect",
      },
    ],
  },
  {
    slug: "synergy",
    name: "Synergy",
    group: "Couples (6+ Years Married)",
    ageRange: "6+ yrs married",
    tagline: "Legacy, built together.",
    description:
      "Seasoned couples building legacy — needing depth, purpose and a hand on the next generation.",
    mission:
      "To empower seasoned couples to maximize their long-term family wealth, sustain generational marital resilience, and transition into vital community leadership and marital mentorship.",
    vision:
      "A structural cornerstone of mature couples driving multi-generational financial and spiritual legacy while serving as active mentors for younger marriages.",
    heroImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80",
    color: "#8A9A5B",
    colorDark: "#4D7C0F",
    whatsappGroupLink: "https://chat.whatsapp.com/Kpu7AGhZylQHztX9HvLR2t",
    pillarLabels: {
      Shift: "Legacy",
      Sanctuary: "Resilience",
      Connect: "Mentoring",
    },
    programs: [
      {
        name: "Generational Wealth Modelling",
        blurb: "Long-term family wealth strategies.",
        detail:
          "Model the long game together — what you build now and how it passes to the generation after you.",
        pillar: "Shift",
      },
      {
        name: "University Funding Projections",
        blurb: "Varsity funds planned years ahead.",
        detail:
          "Project study costs years out and build the savings plan that gets every child to varsity.",
        pillar: "Shift",
      },
      {
        name: "Property & Portfolio",
        blurb: "Shared property and investment portfolios.",
        detail:
          "Optimise what you hold together — property, investments and a portfolio that serves the whole family.",
        pillar: "Shift",
      },
      {
        name: "Longevity Circles",
        blurb: "Marital longevity maintenance.",
        detail:
          "Circles for couples a few decades in — keeping the marriage healthy, warm and intentional over the long haul.",
        pillar: "Sanctuary",
      },
      {
        name: "Empty-Nest Preparation",
        blurb: "Preparing for the season after the kids.",
        detail:
          "Prepare for the quiet house — conversations and rituals that carry a marriage into its next season.",
        pillar: "Sanctuary",
      },
      {
        name: "Family Intercession Network",
        blurb: "High-level family prayer networks.",
        detail:
          "A prayer network covering the families of the house — standing together for children, homes and marriages.",
        pillar: "Sanctuary",
      },
      {
        name: "Couples' Retreats",
        blurb: "Premium weekend couples' retreats.",
        detail:
          "Premium weekend retreats for married couples — rest, reconnection and time to think about the decades ahead.",
        pillar: "Connect",
      },
      {
        name: "Legacy Galas",
        blurb: "Formal dinners and annual celebrations.",
        detail:
          "Formal dinners and galas celebrating the families who have built something that lasts.",
        pillar: "Connect",
      },
      {
        name: "Spark Mentorship",
        blurb: "Structured mentoring for newer couples.",
        detail:
          "A structured path to mentor Spark couples — hand what you've learned to the marriages starting out.",
        pillar: "Connect",
      },
    ],
  },
];

export function getClub(slug: string): RelateClub | undefined {
  return CLUBS.find((c) => c.slug === slug);
}

/** Group a club's programs by pillar. Clubs whose programs carry no pillar
 *  (Sprout) come back as a single unnamed group. */
export function programsByPillar(
  club: RelateClub,
): { pillar: RelatePillar | null; label: string | null; programs: RelateProgram[] }[] {
  const grouped: {
    pillar: RelatePillar | null;
    label: string | null;
    programs: RelateProgram[];
  }[] = PILLARS.map((pillar) => ({
    pillar,
    label: club.pillarLabels?.[pillar] ?? null,
    programs: club.programs.filter((p) => p.pillar === pillar),
  })).filter((g) => g.programs.length > 0);

  const ungrouped = club.programs.filter((p) => !p.pillar);
  if (ungrouped.length > 0) grouped.push({ pillar: null, label: null, programs: ungrouped });
  return grouped;
}

/** URL segment for a program name, shared by the club page links, the
 *  /[club]/[program] route and the sitemap so all three agree. */
export function programSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStoreItem(id: string): StoreItem | undefined {
  return STORE_ITEMS.find((s) => s.id === id);
}

export type RelateSport = "Football" | "Netball" | "Volleyball";

export type RelateTeam = {
  id: string;
  clubSlug: string;
  sport: RelateSport;
  name: string;
  initials: string;
  tagline: string;
  /** Squad crest — a square image carrying the club name and the sport. */
  logo?: string;
};

export const SPORTS: RelateSport[] = ["Football", "Netball", "Volleyball"];

export const SPORTS_TEAMS: RelateTeam[] = [
  // Sprout — three clubs, each with its own squads
  // Football
  {
    id: "sk-fc",
    clubSlug: "sprout-kids",
    sport: "Football",
    name: "Sprout Kids FC",
    initials: "SK FC",
    tagline: "Our youngest squad — Saturday kickabouts, camps and fun skills games.",
    logo: "/images/sports/football/sprout-kids.jpg",
  },
  {
    id: "stw-fc",
    clubSlug: "sprout-tweens",
    sport: "Football",
    name: "Sprout Tweens FC",
    initials: "TW FC",
    tagline: "Junior league football — skills, teamwork and match days.",
    logo: "/images/sports/football/sprout-tweens.jpg",
  },
  {
    id: "ste-fc",
    clubSlug: "sprout-teens",
    sport: "Football",
    name: "Sprout Teens FC",
    initials: "TE FC",
    tagline: "The senior Sprout squad — competitive fixtures all season.",
    logo: "/images/sports/football/sprout-teens.jpg",
  },
  {
    id: "surge-fc",
    clubSlug: "surge",
    sport: "Football",
    name: "Surge FC",
    initials: "SFC",
    tagline: "Youth league team — midweek training, weekend matches.",
    logo: "/images/sports/football/surge.jpg",
  },
  {
    id: "pulse-fc",
    clubSlug: "pulse",
    sport: "Football",
    name: "Pulse FC",
    initials: "PFC",
    tagline: "Sunday fixtures under the lights at the Relate grounds.",
    logo: "/images/sports/football/pulse.jpg",
  },
  // Netball
  {
    id: "sk-netball",
    clubSlug: "sprout-kids",
    sport: "Netball",
    name: "Sprout Kids Netball",
    initials: "SKN",
    tagline: "Saturday morning netball for kids — all positions, all fun.",
    logo: "/images/sports/netball/sprout-kids.jpg",
  },
  {
    id: "stw-netball",
    clubSlug: "sprout-tweens",
    sport: "Netball",
    name: "Sprout Tweens Netball",
    initials: "TWN",
    tagline: "League netball for tweens — weekend games, weekly training.",
    logo: "/images/sports/netball/sprout-tweens.jpg",
  },
  {
    id: "ste-netball",
    clubSlug: "sprout-teens",
    sport: "Netball",
    name: "Sprout Teens Netball",
    initials: "TEN",
    tagline: "Competitive teen netball — tournaments and club nights.",
    logo: "/images/sports/netball/sprout-teens.jpg",
  },
  {
    id: "surge-netball",
    clubSlug: "surge",
    sport: "Netball",
    name: "Surge Netball",
    initials: "SN",
    tagline: "Competitive youth netball running with the school term.",
    logo: "/images/sports/netball/surge.jpg",
  },
  {
    id: "pulse-netball",
    clubSlug: "pulse",
    sport: "Netball",
    name: "Pulse Netball",
    initials: "PN",
    tagline: "Evening netball clinic — every skill level welcome.",
    logo: "/images/sports/netball/pulse.jpg",
  },
  // Volleyball — Surge and Pulse only.
  {
    id: "surge-volleyball",
    clubSlug: "surge",
    sport: "Volleyball",
    name: "Surge Volleyball",
    initials: "SV",
    tagline: "Friday court sessions — learn the game, make the team.",
    logo: "/images/sports/volleyball/surge.jpg",
  },
  {
    id: "pulse-volleyball",
    clubSlug: "pulse",
    sport: "Volleyball",
    name: "Pulse Volleyball",
    initials: "PV",
    tagline: "Weekend tournaments and social volleyball.",
    logo: "/images/sports/volleyball/pulse.jpg",
  },
];

export function teamsForSport(sport: RelateSport): RelateTeam[] {
  return SPORTS_TEAMS.filter((t) => t.sport === sport);
}

export function teamsForClub(clubSlug: string): RelateTeam[] {
  return SPORTS_TEAMS.filter((t) => t.clubSlug === clubSlug);
}

/** Look up a club or a Sprout sub-club (kids / tweens / teens). */
export function getRelateClub(
  slug: string | undefined,
): RelateClub | undefined {
  if (!slug) return undefined;
  return CLUBS.find((c) => c.slug === slug) ?? SUB_CLUBS.find((c) => c.slug === slug);
}

const SPROUT_CLASS_PROGRAMS: RelateProgram[] = [
  {
    name: "Reading Circle",
    blurb: "Literacy development and reading encouragement.",
    detail:
      "Children read aloud in small circles, earn reading badges and take home books each week to build a lifelong love of reading.",
  },
  {
    name: "Memory Verse Club",
    blurb: "Learn a verse each month, recite it, and grow.",
    detail:
      "Each month we learn one Bible verse together. Practice it during the week and share it at club — earn a sticker for every verse you recite.",
  },
  {
    name: "Character Building",
    blurb: "Life skills, values and confidence workshops.",
    detail:
      "Short workshops on honesty, courage, kindness and confidence — the soft skills school doesn't teach.",
  },
  {
    name: "Creative Arts",
    blurb: "Art, music and drama workshops.",
    detail:
      "Rotating workshops in drawing, singing and drama, ending each term with a showcase for parents.",
  },
  {
    name: "Bible Adventurers",
    blurb: "Story-themed games that bring the Bible alive.",
    detail:
      "An adventure through Bible stories with games, crafts and role-play — a fun way to learn the big stories of Scripture.",
  },
  {
    name: "Football Club",
    blurb: "Weekly training and friendly matches.",
    detail:
      "Learn the basics, train with friends and play friendly matches. Bring trainers, a water bottle and lots of energy — everyone gets a game.",
  },
  {
    name: "Netball Club",
    blurb: "Weekly training and friendly matches.",
    detail:
      "Learn passing, shooting and teamwork on the netball court. Bring gym shoes and a water bottle — beginners are very welcome.",
  },
];

export const SUB_CLUBS: RelateClub[] = [
  {
    slug: "sprout-kids",
    name: "Sprout Kids",
    group: "Children",
    ageRange: "6 – 8 yrs",
    parentSlug: "sprout",
    tagline: "Little roots, first shoots.",
    description:
      "Our youngest Sprout members — eager, curious and ready to grow. Activities are playful and safe, with gentle guidance from volunteer leaders.",
    heroImage: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80",
    color: "#66BB6A",
    colorDark: "#388E3C",
    whatsappGroupLink: "https://chat.whatsapp.com/DdZ3vBcZtfLCuoS9BqEL6n",
    programs: SPROUT_CLASS_PROGRAMS,
  },
  {
    slug: "sprout-tweens",
    name: "Sprout Tweens",
    group: "Children",
    ageRange: "9 – 11 yrs",
    parentSlug: "sprout",
    tagline: "Growing strong, finding their voice.",
    description:
      "Tweens exploring who they are becoming — independence with a safety net. Bigger challenges, real leadership and widening friendships.",
    heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
    color: "#4CAF50",
    colorDark: "#2E7D32",
    whatsappGroupLink: "https://chat.whatsapp.com/DdZ3vBcZtfLCuoS9BqEL6n",
    programs: SPROUT_CLASS_PROGRAMS,
  },
  {
    slug: "sprout-teens",
    name: "Sprout Teens",
    group: "Children",
    ageRange: "12 – 15 yrs",
    parentSlug: "sprout",
    tagline: "Reaching high, ready for more.",
    description:
      "Teens stepping toward adulthood — leadership, mentorship and bigger challenges in a community that knows them by name.",
    heroImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80",
    color: "#43A047",
    colorDark: "#1B5E20",
    whatsappGroupLink: "https://chat.whatsapp.com/DdZ3vBcZtfLCuoS9BqEL6n",
    programs: SPROUT_CLASS_PROGRAMS,
  },
];

export function getClubClasses(slug: string): RelateClub[] {
  return SUB_CLUBS.filter((c) => c.parentSlug === slug);
}

export function getClubClass(slug: string): RelateClub | undefined {
  return SUB_CLUBS.find((c) => c.slug === slug);
}

export type MagazineEdition = {
  label: string;
  ageRange: string;
  clubSlug: string;
  summary: string;
  weekTitles: string[];
};

export type RelateMagazine = {
  slug: string;
  series: string;
  clubName: string;
  clubSlug: string;
  theme: string;
  seasonLabel: string;
  cover: string;
  coverLines: string[];
  summary: string;
  editions: MagazineEdition[];
};

export const MAGAZINES: RelateMagazine[] = [
  {
    slug: "footsteps",
    series: "Footsteps",
    clubName: "Surge",
    clubSlug: "surge",
    theme: "The Jesus Way",
    seasonLabel: "Spring 2026 · Sep 1 – Nov 30",
    cover: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1600&q=85",
    coverLines: [
      "Walk with Jesus for thirteen weeks",
      "The way, the truth, the life",
      "Follow the footsteps",
    ],
    summary:
      "Spring 2026 study guide for Surge: thirteen weeks of walking the Jesus way — the call, the beatitudes, the lower love, the cross, the sending. One verse and one daily read for every day of the season.",
    editions: [
      {
        label: "Footsteps",
        ageRange: "16–21 yrs",
        clubSlug: "surge",
        summary:
          "The Surge study guide — a daily read for every day of the Spring 2026 season.",
        weekTitles: [
          "The call",
          "Blessed foundations",
          "Love that goes lower",
          "Truth that sets free",
          "Money and the kingdom",
          "Prayer that persists",
          "The cross-shaped life",
          "Faith for the long road",
          "Forgiveness without limit",
          "The kingdom in you",
          "Communion and joining",
          "Sent ones",
          "Hope that holds",
        ],
      },
    ],
  },
  {
    slug: "rooted",
    series: "Rooted",
    clubName: "Sprout",
    clubSlug: "sprout",
    theme: "Roots & Shoots",
    seasonLabel: "Spring 2026 · Sep 1 – Nov 30",
    cover: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=85",
    coverLines: [
      "A seed is not in a hurry",
      "Thirteen weeks to a strong tree",
      "Grow where you're planted",
    ],
    summary:
      "The Spring 2026 study guide for Sprout children and teens — three age-graded editions growing from a tiny seed to a tree with deep roots. A verse, a try-it and a prayer for every day of the season.",
    editions: [
      {
        label: "Rooted — Kids",
        ageRange: "6–8 yrs",
        clubSlug: "sprout",
        summary:
          "From a tiny seed to a tree with deep roots — one verse and one try-it for every day of the season.",
        weekTitles: [
          "The tiniest seed",
          "Water and roots",
          "Sunlight",
          "Good soil",
          "Pulling weeds",
          "The strong sprout",
          "The straight stem",
          "Reaching leaves",
          "The patient bud",
          "Opening blossoms",
          "Sweet fruit",
          "Deep roots in storms",
          "The giving garden",
        ],
      },
      {
        label: "Rooted — Tweens",
        ageRange: "9–11 yrs",
        clubSlug: "sprout",
        summary:
          "The hidden root, living water, storms, pruning and fruit — with a verse and a try-it for every day.",
        weekTitles: [
          "The hidden root",
          "Living water",
          "The sun above",
          "The taproot",
          "Storm weather",
          "The pruning year",
          "One trunk",
          "Spreading branches",
          "Scattering seeds",
          "Seasonal fruit",
          "Tree by the water",
          "Rings of the season",
          "The giving grove",
        ],
      },
      {
        label: "Rooted — Teens",
        ageRange: "12–15 yrs",
        clubSlug: "sprout",
        summary:
          "Belonging, doubt, identity, storms and fruit — growing up with a verse and a try-it for every day.",
        weekTitles: [
          "Chosen family",
          "Honest questions",
          "The drought",
          "Image bearers",
          "Bent trunks",
          "Grafted in",
          "Growth rings",
          "The trellis",
          "Humble seeds",
          "Daily fruit",
          "Winter rest",
          "Waiting sap",
          "The grove",
        ],
      },
    ],
  },
];

export function getMagazine(slug: string): RelateMagazine | undefined {
  return MAGAZINES.find((m) => m.slug === slug);
}

export function getMagazinesForClub(clubSlug: string): RelateMagazine[] {
  return MAGAZINES.filter((m) => m.clubSlug === clubSlug);
}

export type StoreCategory = "All" | "Apparel" | "Accessories" | "Home & Study";

export type StoreItem = {
  id: string;
  category: Exclude<StoreCategory, "All">;
  name: string;
  price: number;
  image: string;
  blurb: string;
  offerPrice?: number;
  rating?: number;
  sizes?: string[];
  images?: string[];
  details?: string[];
};

const MERCH = (src: string) => `/images/store/relate-tee/${src}`;

export const STORE_CATEGORIES: StoreCategory[] = [
  "All",
  "Apparel",
  "Accessories",
  "Home & Study",
];

const PHOTO = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=400&fit=crop&q=80&auto=format`;

export const STORE_ITEMS: StoreItem[] = [
  {
    id: "relate-tee",
    category: "Apparel",
    name: "Relate Tee (Black)",
    price: 160,
    rating: 4.9,
    image: MERCH("t-shirt-1.png"),
    images: [
      "t-shirt-1.png",
      "t-shirt-2.png",
      "t-shirt-3.png",
      "t-shirt-4.png",
      "t-shirt-5.png",
      "t-shirt-6.png",
      "t-shirt-7.png",
    ].map(MERCH),
    sizes: ["XS", "S", "M", "L", "XL"],
    details: [
      "Heavyweight 100% ringspun cotton in black",
      "Gold Relate emblem printed on the chest",
      "Unisex fit — sizes XS to XL",
      "Every purchase funds Relate clubs & programs",
      "Order on WhatsApp — pay on delivery or EFT",
    ],
    blurb: "Heavyweight black tee in soft ringspun cotton with the gold Relate emblem — sizes XS to XL.",
  },
  {
    id: "club-hoodie",
    category: "Apparel",
    name: "Club Hoodie",
    price: 450,
    rating: 4.6,
    image: PHOTO("photo-1556821840-3a63f95609a7"),
    blurb: "Cozy pullover hoodie for club days and camps.",
  },
  {
    id: "faith-cap",
    category: "Apparel",
    name: "Faith Cap",
    price: 180,
    rating: 3.9,
    image: PHOTO("photo-1521369909029-2afed882baee"),
    blurb: "Gold-embroidered cap for sunny outings.",
  },
  {
    id: "tote-bag",
    category: "Accessories",
    name: "Tote Bag",
    price: 150,
    rating: 4.5,
    image: PHOTO("photo-1597484661643-2f5fef640dd1"),
    blurb: "Everyday tote — books, snacks and everything in between.",
  },
  {
    id: "sip-bottle",
    category: "Accessories",
    name: "Sip Bottle",
    price: 190,
    rating: 3.8,
    image: PHOTO("photo-1602143407151-7111542de6e8"),
    blurb: "BPA-free bottle to keep your water cold.",
  },
  {
    id: "faith-wristband",
    category: "Accessories",
    name: "Faith Wristband",
    price: 30,
    rating: 3.6,
    image: PHOTO("photo-1573408301185-9146fe634ad0"),
    blurb: "Silicone wristband — wear your club colours.",
  },
  {
    id: "sunday-mug",
    category: "Home & Study",
    name: "Sunday Mug",
    price: 160,
    rating: 4.7,
    image: PHOTO("photo-1514228742587-6b1558fcca3d"),
    blurb: "Heavy ceramic mug for study breaks.",
  },
  {
    id: "study-notebook",
    category: "Home & Study",
    name: "Notebook",
    price: 90,
    rating: 3.9,
    image: PHOTO("photo-1524995997946-a1c2e315a42f"),
    blurb: "A5 notebook for homework and ideas.",
  },
  {
    id: "prayer-journal",
    category: "Home & Study",
    name: "Prayer Journal",
    price: 140,
    rating: 4.8,
    image: PHOTO("photo-1544716278-ca5e3f4abd8c"),
    blurb: "Guided journal with weekly reflection pages.",
  },
  {
    id: "sticker-pack",
    category: "Home & Study",
    name: "Sticker Pack",
    price: 40,
    rating: 3.7,
    image: PHOTO("photo-1618005182384-a83a8bd57fbe"),
    blurb: "Ten vinyl stickers for books and laptops.",
  },
];