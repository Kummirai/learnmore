/**
 * Sprout Camp — details for /sprout/sprout-camp.
 *
 * Placeholder figures for the next camp edition: swap the dates, venue and
 * fee for the real ones here and the page (plus the registration form's
 * edition stamp) updates everywhere.
 */

export type CampSlot = {
  time: string;
  title: string;
  detail?: string;
};

export type CampDay = {
  id: string;
  day: string;
  date: string;
  title: string;
  slots: CampSlot[];
};

export type CampFaq = { q: string; a: string };

export type SproutCamp = {
  slug: string;
  /** Stamped on every registration so editions never collide. */
  edition: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  location: string;
  dateLabel: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  ageRange: string;
  fee: string;
  feeNote: string;
  capacity: number;
  deposit: string;
  includes: string[];
  bring: string[];
  highlights: { title: string; body: string }[];
  itinerary: CampDay[];
  faq: CampFaq[];
  contact: { label: string; href: string }[];
};

export const SPROUT_CAMP: SproutCamp = {
  slug: "sprout-camp",
  edition: "2026-12-holiday",
  title: "Sprout Camp",
  tagline: "Four days. One campfire. Growing strong together.",
  description:
    "An overnight holiday camp for Sprout kids, tweens and teens — hikes, campfires, team challenges, honors workshops and a whole lot of joy, subsidised so every child can attend.",
  image:
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=80",
  location: "Relate Grounds, Gauteng",
  dateLabel: "10 – 13 December 2026",
  startDate: "2026-12-10",
  endDate: "2026-12-13",
  registrationDeadline: "2026-11-28",
  ageRange: "6 – 15 yrs",
  fee: "R750",
  feeNote:
    "Covers accommodation, all meals, camp t-shirt and activities. Subsidised — no child misses camp for money, and sibling discounts apply.",
  capacity: 120,
  deposit: "R150 deposit secures a place, balance on arrival",
  includes: [
    "Four days and three nights of supervised accommodation",
    "All meals, snacks and campfire treats",
    "Camp t-shirt and honor badge kit",
    "Activities, transport on site and first-aid cover",
  ],
  bring: [
    "Sleeping bag, towel and toiletries",
    "Warm jacket and wet-weather layer",
    "Closed shoes for hikes + sandals for the showers",
    "Refillable water bottle and a torch",
    "Any medication, clearly labelled with instructions",
    "Bible and a pen",
  ],
  highlights: [
    {
      title: "Campfire nights",
      body: "Songs, skits and stories under the stars after every day's challenges.",
    },
    {
      title: "Honors workshops",
      body: "Work on Life Saver, Smart Saver and Digital Explorer requirements with leaders on hand to sign off.",
    },
    {
      title: "Team challenges",
      body: "Hikes, relays and problem-solving missions mixed across the three age squads.",
    },
    {
      title: "Safe by design",
      body: "Vetted leaders, age-matched squads, first-aid cover and a parent briefing before departure.",
    },
  ],
  itinerary: [
    {
      id: "day-1",
      day: "Day 1",
      date: "Thu 10 Dec",
      title: "Arrive & settle in",
      slots: [
        { time: "14:00", title: "Check-in & squad handover", detail: "Parents sign in, meet the squad leaders." },
        { time: "15:30", title: "Camp tour & safety briefing", detail: "Grounds, toilets, muster point, buddy system." },
        { time: "17:00", title: "Squad games", detail: "Icebreakers mixed across kids, tweens and teens." },
        { time: "19:00", title: "Dinner & campfire", detail: "Opening night songs and the week's challenge board." },
      ],
    },
    {
      id: "day-2",
      day: "Day 2",
      date: "Fri 11 Dec",
      title: "Trails & talents",
      slots: [
        { time: "07:00", title: "Wake-up & breakfast" },
        { time: "08:30", title: "Morning hike", detail: "Age-graded routes with a leader at the front and back." },
        { time: "11:00", title: "Honors workshops", detail: "First aid, money skills and block coding stations." },
        { time: "15:00", title: "Team challenge round" },
        { time: "19:00", title: "Campfire & testimonies" },
      ],
    },
    {
      id: "day-3",
      day: "Day 3",
      date: "Sat 12 Dec",
      title: "Big day out",
      slots: [
        { time: "07:00", title: "Wake-up & breakfast" },
        { time: "09:00", title: "Carnival & water games", detail: "Relays, tug-of-war and the famous Sponge Run." },
        { time: "13:00", title: "Free time & rest hour" },
        { time: "15:00", title: "Honors sign-off sessions", detail: "Leaders verify requirements earned during camp." },
        { time: "19:00", title: "Campfire banquet" },
      ],
    },
    {
      id: "day-4",
      day: "Day 4",
      date: "Sun 13 Dec",
      title: "Send-off",
      slots: [
        { time: "07:30", title: "Pack up & breakfast" },
        { time: "09:30", title: "Closing celebration", detail: "Badge awards and the camp video." },
        { time: "11:00", title: "Parent pickup", detail: "Collect campers and progress cards from leaders." },
      ],
    },
  ],
  faq: [
    {
      q: "Who can come to camp?",
      a: "Any Sprout member aged 6 to 15. Kids, tweens and teens run as separate squads with their own leaders, and campers are grouped by age for sleeping and activities.",
    },
    {
      q: "Does my child need to be a member already?",
      a: "No — register right here on the page and we'll create the membership as part of sign-up. Leaders follow up before camp to confirm details.",
    },
    {
      q: "How do payment and sibling discounts work?",
      a: "A R150 deposit secures the place, with the balance due on arrival. Siblings get 20% off the second and third child, and hardship support is available — ask in confidence.",
    },
    {
      q: "How do you handle medical needs and allergies?",
      a: "The registration form captures medication, allergies and dietary needs. Our first-aid team holds the record, medication is locked and administered by leaders, and no prescribed medicine is given without written parent consent.",
    },
    {
      q: "Can leaders contact me during camp?",
      a: "Yes — the camp WhatsApp group opens two weeks before departure, and there is a duty phone on site for urgent parent contact at any hour.",
    },
    {
      q: "What if we need to cancel?",
      a: "Cancel before 28 November for a full refund of anything paid. After that, deposits transfer to the next camp edition if you let us know before departure day.",
    },
  ],
  contact: [
    { label: "Camp office · WhatsApp", href: "https://chat.whatsapp.com/DdZ3vBcZtfLCuoS9BqEL6n" },
    { label: "Email the team", href: "mailto:camp@relateworld.org" },
  ],
};
