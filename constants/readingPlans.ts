/**
 * Relate reading plans — content mirrors the mobile app's
 * src/constants/reading-plans.ts (titles, taglines, descriptions, day counts,
 * gradients and cover images are the app's real data).
 */

export type RelateReadingPlan = {
    slug: string;
    title: string;
    tagline: string;
    description: string;
    category: string;
    section: string;
    days: number;
    gradient: [string, string];
    image: string;
    /** True when the plan was authored in the admin editor (backend). */
    authored?: boolean;
};

export const READING_PLAN_CATEGORIES = [
    "Bible Reading",
    "Marriage & Relationships",
    "Emotional Wellness",
    "Academic",
    "Finance & Stewardship",
] as const;

export const READING_PLANS: RelateReadingPlan[] = [
    // ─── Bible Reading ──────────────────────────────
    {
        slug: "bible-in-a-year",
        title: "Bible in a Year",
        tagline: "The whole Bible in 365 days",
        description: "Read the entire Bible from Genesis to Revelation — roughly 3-4 chapters a day. The classic year-long journey through every book of Scripture.",
        category: "Bible Reading",
        section: "Whole Bible",
        days: 365,
        gradient: ["#7fb069", "#26502b"],
        image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=300&fit=crop",
    },
    {
        slug: "old-testament-in-180-days",
        title: "Old Testament in 180 Days",
        tagline: "Genesis to Malachi in six months",
        description: "Walk through all 39 books of the Old Testament — the Law, history, poetry and prophets — in a focused six-month journey.",
        category: "Bible Reading",
        section: "Old Testament",
        days: 180,
        gradient: ["#5c8d4e", "#a3c585"],
        image: "https://images.unsplash.com/photo-1533709752211-118fcaf03312?w=600&h=300&fit=crop",
    },
    {
        slug: "new-testament-in-90-days",
        title: "New Testament in 90 Days",
        tagline: "Gospels to Revelation in three months",
        description: "Read every chapter of the New Testament — from Matthew's Gospel to Revelation — in just ninety days, about three chapters a day.",
        category: "Bible Reading",
        section: "New Testament",
        days: 90,
        gradient: ["#ffc42e", "#c9971b"],
        image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=300&fit=crop",
    },
    {
        slug: "gospels-in-40-days",
        title: "Gospels in 40 Days",
        tagline: "The life of Jesus, cover to cover",
        description: "Immerse yourself in the four Gospels — Matthew, Mark, Luke and John — reading the full account of Jesus' life and ministry in forty days.",
        category: "Bible Reading",
        section: "New Testament",
        days: 40,
        gradient: ["#ffc42e", "#5c8d4e"],
        image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=300&fit=crop",
    },
    {
        slug: "pentateuch-in-60-days",
        title: "The Pentateuch in 60 Days",
        tagline: "Genesis, Exodus, Leviticus, Numbers, Deuteronomy",
        description: "Study the first five books of the Bible — creation, covenant, law and the journey of God's people — in sixty days.",
        category: "Bible Reading",
        section: "Old Testament",
        days: 60,
        gradient: ["#4caf50", "#5c8d4e"],
        image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&h=300&fit=crop",
    },
    {
        slug: "psalms-and-proverbs-in-31-days",
        title: "Psalms & Proverbs in 31 Days",
        tagline: "Five psalms and a proverb every day",
        description: "Pray through the Psalms and grow in wisdom through Proverbs — five psalms and one proverb a day for a full month.",
        category: "Bible Reading",
        section: "Wisdom",
        days: 31,
        gradient: ["#c9971b", "#7fb069"],
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=300&fit=crop",
    },

    // ─── Marriage & Relationships ───────────────────
    {
        slug: "marriage-in-30-days",
        title: "Marriage in 30 Days",
        tagline: "Build a marriage that honors God",
        description: "Explore God's design for marriage through 30 days of Scripture.",
        category: "Marriage & Relationships",
        section: "Marriage",
        days: 30,
        gradient: ["#e91e63", "#c2185b"],
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=300&fit=crop",
    },
    {
        slug: "love-and-conflict-in-21-days",
        title: "Love & Conflict in 21 Days",
        tagline: "Navigate disagreement with grace",
        description: "21 days of biblical wisdom for resolving conflict and building stronger relationships.",
        category: "Marriage & Relationships",
        section: "Conflict",
        days: 21,
        gradient: ["#ff7043", "#d84315"],
        image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=300&fit=crop",
    },
    {
        slug: "parenting-in-14-days",
        title: "Parenting in 14 Days",
        tagline: "Raise children who love God",
        description: "14 days of Scripture-based parenting wisdom for every season.",
        category: "Marriage & Relationships",
        section: "Parenting",
        days: 14,
        gradient: ["#ab47bc", "#7b1fa2"],
        image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&h=300&fit=crop",
    },

    // ─── Emotional Wellness ─────────────────────────
    {
        slug: "peace-in-the-storm",
        title: "Peace in the Storm",
        tagline: "Find calm through faith",
        description: "21 days of biblical truth to anchor your heart in anxiety and fear.",
        category: "Emotional Wellness",
        section: "Anxiety",
        days: 21,
        gradient: ["#26a69a", "#00695c"],
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop",
    },
    {
        slug: "hope-in-the-darkness",
        title: "Hope in the Darkness",
        tagline: "Light for seasons of despair",
        description: "21 days of hope-filled Scripture for depression, loss, and hard seasons.",
        category: "Emotional Wellness",
        section: "Depression",
        days: 21,
        gradient: ["#fdd835", "#f9a825"],
        image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=300&fit=crop",
    },
    {
        slug: "casting-your-cares",
        title: "Casting Your Cares",
        tagline: "Surrender your worries to God",
        description: "21 days learning to cast every anxiety on the Lord through prayer.",
        category: "Emotional Wellness",
        section: "Worry",
        days: 21,
        gradient: ["#42a5f5", "#1565c0"],
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=300&fit=crop",
    },

    // ─── Finance & Stewardship ──────────────────────
    {
        slug: "budgeting-and-saving",
        title: "Budgeting & Saving",
        tagline: "Honor God with your finances",
        description: "21 days of biblical wisdom on stewardship, contentment, and generosity.",
        category: "Finance & Stewardship",
        section: "Budgeting",
        days: 21,
        gradient: ["#10b981", "#065f46"],
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=300&fit=crop",
    },
    {
        slug: "getting-out-of-debt",
        title: "Getting Out of Debt",
        tagline: "Break free from financial bondage",
        description: "21 days of practical, biblical steps to eliminate debt.",
        category: "Finance & Stewardship",
        section: "Debt Freedom",
        days: 21,
        gradient: ["#f43f5e", "#9f1239"],
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=300&fit=crop",
    },
    {
        slug: "building-wealth-wisely",
        title: "Building Wealth Wisely",
        tagline: "Grow resources for God's glory",
        description: "21 days on biblical wealth-building, generosity, and kingdom investing.",
        category: "Finance & Stewardship",
        section: "Wealth Building",
        days: 21,
        gradient: ["#8b5cf6", "#4c1d95"],
        image: "https://images.unsplash.com/photo-1553729459-uj0gfqcewkfd?w=600&h=300&fit=crop",
    },

    // ─── Academic ───────────────────────────────────
    {
        slug: "hermeneutics",
        title: "Hermeneutics",
        tagline: "How to study the Bible",
        description: "36-week guide to biblical interpretation — resources, practice labs, and master questions.",
        category: "Academic",
        section: "Interpretation",
        days: 50,
        gradient: ["#6366f1", "#312e81"],
        image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=300&fit=crop",
    },
    {
        slug: "theology",
        title: "Theology",
        tagline: "Systematic study of Christian doctrine",
        description: "30 weeks exploring all 11 categories of systematic theology.",
        category: "Academic",
        section: "Doctrine",
        days: 210,
        gradient: ["#0ea5e9", "#0c4a6e"],
        image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=300&fit=crop",
    },
    {
        slug: "apologetics",
        title: "Apologetics",
        tagline: "Defending the faith with grace",
        description: "21 weeks of biblical and historical evidence for the Christian faith.",
        category: "Academic",
        section: "Defense",
        days: 147,
        gradient: ["#14b8a6", "#134e4a"],
        image: "https://images.unsplash.com/photo-1457369804613-52c61a422e7f?w=600&h=300&fit=crop",
    },
    {
        slug: "biblical-studies",
        title: "Biblical Studies",
        tagline: "Survey of every book of the Bible",
        description: "14 weeks surveying both Testaments — every book, genre, and theme.",
        category: "Academic",
        section: "Survey",
        days: 98,
        gradient: ["#a78bfa", "#4c1d95"],
        image: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&h=300&fit=crop",
    },
    {
        slug: "church-history",
        title: "Church History",
        tagline: "Two thousand years of God's faithfulness",
        description: "20 weeks tracing the Christian church from AD 30 to today.",
        category: "Academic",
        section: "History",
        days: 140,
        gradient: ["#f59e0b", "#78350f"],
        image: "https://images.unsplash.com/photo-1548407260-da850faa41e8?w=600&h=300&fit=crop",
    },
    {
        slug: "spiritual-disciplines",
        title: "Spiritual Disciplines",
        tagline: "Practices that draw you closer to God",
        description: "12 weeks cultivating the core spiritual disciplines of the Christian life.",
        category: "Academic",
        section: "Practice",
        days: 84,
        gradient: ["#22c55e", "#14532d"],
        image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=300&fit=crop",
    },
];

export function getReadingPlan(slug: string): RelateReadingPlan | undefined {
    return READING_PLANS.find((p) => p.slug === slug);
}
