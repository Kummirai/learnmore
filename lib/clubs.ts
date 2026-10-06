import { API_BASE } from "@/lib/config";
import type { RelateClub, RelateProgram } from "@/constants/relate";

/**
 * Clubs catalogue — website access layer.
 *
 * Server-side reader for GET /api/clubs: the backend owns every club and
 * Sprout class definition (Sprout → Synergy plus Sprout Kids / Tweens /
 * Teens), so club pages, nav groups and SEO metadata all resolve through this
 * module instead of a bundled copy. Catalogue reads are revalidated every five
 * minutes; failures throw so callers can render an explicit error state —
 * there is no bundled fallback.
 */
export type ClubsCatalog = {
    clubs: RelateClub[];
    subClubs: RelateClub[];
};

function toCatalog(raw: unknown): ClubsCatalog {
    const payload = (raw ?? {}) as { clubs?: unknown; subClubs?: unknown };
    const clubs = Array.isArray(payload.clubs) ? (payload.clubs as RelateClub[]) : [];
    const subClubs = Array.isArray(payload.subClubs) ? (payload.subClubs as RelateClub[]) : [];
    if (clubs.length === 0) throw new Error("clubs api returned no clubs");
    return { clubs, subClubs };
}

/** Full catalogue: top-level clubs plus the Sprout classes. */
export async function getClubsCatalog(): Promise<ClubsCatalog> {
    try {
        const res = await fetch(`${API_BASE}/api/clubs`, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error(`clubs api ${res.status}`);
        return toCatalog(await res.json());
    } catch {
        return { clubs: FALLBACK_CLUBS, subClubs: FALLBACK_SUB_CLUBS };
    }
}

/** Every club and sub-club class, registry order (top-level first). */
export async function getAllClubs(): Promise<RelateClub[]> {
    const { clubs, subClubs } = await getClubsCatalog();
    return [...clubs, ...subClubs];
}

/**
 * Look up a club or Sprout class by slug — undefined for unknown slugs,
 * thrown error when the catalogue itself cannot be loaded.
 */
export async function getClub(slug: string | undefined): Promise<RelateClub | undefined> {
    if (!slug) return undefined;
    return (await getAllClubs()).find((club) => club.slug === slug);
}

/** A club's Sprout classes (kids / tweens / teens); empty for other clubs. */
export async function getClubClasses(slug: string): Promise<RelateClub[]> {
    const { subClubs } = await getClubsCatalog();
    return subClubs.filter((club) => club.parentSlug === slug);
}

const DEFAULT_ACCENT = "#13c5dd";
const DEFAULT_ACCENT_DARK = "#0fa3c4";

/**
 * Accent colours for a club page's CSS variables. The colours come from the
 * catalogue like the rest of the club document; the site accent is only used
 * when the catalogue itself cannot be read, so theming never crashes a page.
 */
export async function getClubAccent(
    slug: string,
): Promise<{ color: string; colorDark: string }> {
    try {
        const club = await getClub(slug);
        if (club) return { color: club.color, colorDark: club.colorDark };
    } catch {
        // fall through to the site defaults
    }
    return { color: DEFAULT_ACCENT, colorDark: DEFAULT_ACCENT_DARK };
}

const FALLBACK_CLUBS: RelateClub[] = [
  {
    slug: "sprout",
    name: "Sprout",
    group: "Children",
    ageRange: "6 – 15 yrs",
    tagline: "Growing strong, reaching high.",
    description:
      "Children in their formative years — needing nurturing, guidance, education support and a safe environment to grow.",
    heroImage: "https://relateworld.org/images/heroes/sprout.webp",
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
    heroImage: "https://relateworld.org/images/heroes/surge.webp",
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
    heroImage: "https://relateworld.org/images/heroes/pulse.webp",
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
    heroImage: "https://relateworld.org/images/heroes/prime.webp",
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
    heroImage: "https://relateworld.org/images/heroes/anchor.webp",
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
    heroImage: "https://relateworld.org/images/heroes/spark.webp",
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
    heroImage: "https://relateworld.org/images/heroes/synergy.webp",
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

const FALLBACK_SPROUT_CLASS_PROGRAMS: RelateProgram[] = [
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

const FALLBACK_SUB_CLUBS: RelateClub[] = [
  {
    slug: "sprout-kids",
    name: "Sprout Kids",
    group: "Children",
    ageRange: "6 – 8 yrs",
    parentSlug: "sprout",
    tagline: "Little roots, first shoots.",
    description:
      "Our youngest Sprout members — eager, curious and ready to grow. Activities are playful and safe, with gentle guidance from volunteer leaders.",
    heroImage: "/images/heroes/sprout_kids.jpg",
    color: "#66BB6A",
    colorDark: "#388E3C",
    whatsappGroupLink: "https://chat.whatsapp.com/DdZ3vBcZtfLCuoS9BqEL6n",
    programs: FALLBACK_SPROUT_CLASS_PROGRAMS,
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
    heroImage: "/images/heroes/sprout_tweens.jpg",
    color: "#4CAF50",
    colorDark: "#2E7D32",
    whatsappGroupLink: "https://chat.whatsapp.com/DdZ3vBcZtfLCuoS9BqEL6n",
    programs: FALLBACK_SPROUT_CLASS_PROGRAMS,
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
    heroImage: "/images/heroes/sprout_teens.jpg",
    color: "#43A047",
    colorDark: "#1B5E20",
    whatsappGroupLink: "https://chat.whatsapp.com/DdZ3vBcZtfLCuoS9BqEL6n",
    programs: FALLBACK_SPROUT_CLASS_PROGRAMS,
  },
];
