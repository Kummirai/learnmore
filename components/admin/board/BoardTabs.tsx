"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const TABS = [
    {href: "/admin/board-governance", label: "Meetings"},
    {href: "/admin/board-governance/minutes", label: "Log minutes"},
    {href: "/admin/board-governance/archive", label: "Minutes"},
];

export default function BoardTabs() {
    const pathname = usePathname() ?? "";

    return (
        <div className="mb-5 flex flex-wrap gap-1.5 border-b border-gray-200 pb-2">
            {TABS.map((tab) => {
                const active =
                    tab.href === "/admin/board-governance"
                        ? pathname === tab.href
                        : pathname.startsWith(tab.href);
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                            active
                                ? "bg-navy text-white"
                                : "text-slate-gray hover:bg-alice-blue hover:text-navy"
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
