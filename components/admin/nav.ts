import type {IconType} from "react-icons";
import {
    LuLayoutDashboard,
    LuHandHeart,
    LuLifeBuoy,
    LuUsers,
    LuMessageSquare,
    LuUserPlus,
    LuNewspaper,
    LuBookMarked,
    LuFolderOpen,
    LuShoppingBag,
    LuFlame,
    LuBadgeCheck,
} from "react-icons/lu";

export type AdminNavItem = {
    href: string;
    label: string;
    icon: IconType;
    /** Short label used in the collapsed rail. */
    short: string;
    description: string;
};

export type AdminNavGroup = {
    heading: string;
    items: AdminNavItem[];
};

/**
 * Single source of truth for the dashboard sidebar. Grouped so the queue
 * tools stay together and content tools stay together as the console grows.
 */
export const ADMIN_NAV: AdminNavGroup[] = [
    {
        heading: "Overview",
        items: [
            {
                href: "/admin",
                label: "Dashboard",
                short: "Home",
                icon: LuLayoutDashboard,
                description: "Everything happening across Relate, in one place.",
            },
        ],
    },
    {
        heading: "Requests",
        items: [
            {
                href: "/admin/volunteers",
                label: "Volunteer Requests",
                short: "Volunteers",
                icon: LuHandHeart,
                description: "Review and assign people who want to serve.",
            },
            {
                href: "/admin/help-requests",
                label: "Help Requests",
                short: "Help",
                icon: LuLifeBuoy,
                description: "Triage help requests, reply, assign and convert to records.",
            },
            {
                href: "/admin/club-joins",
                label: "Members",
                short: "Members",
                icon: LuUsers,
                description: "Everyone who joined a club or squad — active as soon as they register.",
            },
            {
                href: "/admin/social-joins",
                label: "Social Joins",
                short: "Social",
                icon: LuMessageSquare,
                description: "Approve or decline WhatsApp community join requests.",
            },
        ],
    },
    {
        heading: "People",
        items: [
            {
                href: "/admin/records",
                label: "Family Records",
                short: "Records",
                icon: LuFolderOpen,
                description: "Create, edit and search every family record.",
            },
            {
                href: "/admin/members",
                label: "Members",
                short: "Members",
                icon: LuUserPlus,
                description: "Browse members and manage their roles.",
            },
        ],
    },
    {
        heading: "Content",
        items: [
            {
                href: "/admin/magazines",
                label: "Season Guides",
                short: "Guides",
                icon: LuNewspaper,
                description: "Create, edit and publish season guides and bulletins.",
            },
            {
                href: "/admin/reading-plans",
                label: "Reading Plans",
                short: "Plans",
                icon: LuBookMarked,
                description: "Author reading plans across every category.",
            },
        ],
    },
    {
        heading: "Commerce & Tools",
        items: [
            {
                href: "/admin/store",
                label: "Store",
                short: "Store",
                icon: LuShoppingBag,
                description: "Create and edit merch, pricing and stock.",
            },
            {
                href: "/admin/streaks",
                label: "Restore Streaks",
                short: "Streaks",
                icon: LuFlame,
                description: "Repair reading streaks for members.",
            },
            {
                href: "/admin/skills",
                label: "Skills",
                short: "Skills",
                icon: LuBadgeCheck,
                description: "Roll-up of skills progress across all clubs.",
            },
        ],
    },
];

/** Flat lookup for breadcrumbs and page headers. */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap((g) => g.items);

export function findAdminNavItem(pathname: string): AdminNavItem | undefined {
    // Longest match wins so /admin/magazines/abc resolves to Season Guides.
    return ADMIN_NAV_ITEMS.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)).sort(
        (a, b) => b.href.length - a.href.length,
    )[0];
}

/** Badge counts keyed by href, filled in by the dashboard layout. */
export type AdminNavCounts = Partial<Record<string, number>>;

export const ADMIN_ROLES = ["admin"] as const;

export function isAdminRole(role: string | undefined | null): boolean {
    return role === "admin";
}
