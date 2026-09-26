"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {LuSearch, LuShieldCheck, LuUsers} from "react-icons/lu";
import {AdminHeader, Badge, Field, Select} from "@/components/admin/ui";
import {useAuth} from "@/components/AuthProvider";

type Member = {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string | null;
};

const ROLES = ["user", "facilitator", "admin"] as const;
const ROLE_TONE: Record<string, "gold" | "sky" | "slate"> = {
    admin: "gold",
    facilitator: "sky",
    user: "slate",
    member: "slate",
};
const ROLE_HINT: Record<string, string> = {
    user: "Standard member account.",
    facilitator: "Can run clubs and groups once facilitator training is complete.",
    admin: "Full dashboard access — treat sparingly.",
};

export default function AdminMembersPage() {
    const {user} = useAuth();
    const [members, setMembers] = useState<Member[] | null>(null);
    const [query, setQuery] = useState("");
    const [error, setError] = useState("");
    const [banner, setBanner] = useState("");
    const [busyId, setBusyId] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/users", {cache: "no-store"});
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't load members.");
                setMembers([]);
                return;
            }
            setError("");
            setMembers(Array.isArray(json?.data) ? json.data : []);
        } catch {
            setError("Couldn't reach the API. Is the backend up?");
            setMembers([]);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await load();
        })();
    }, [load]);

    const visible = useMemo(() => {
        if (!members) return null;
        const q = query.trim().toLowerCase();
        const base = q
            ? members.filter((m) => [m.name, m.email, m.role].filter(Boolean).some((f) => String(f).toLowerCase().includes(q)))
            : members;
        return [...base].sort((a, b) => {
            const order = ROLES.indexOf(a.role as never) - ROLES.indexOf(b.role as never);
            if (order !== 0) return -order;
            return (a.name || "").localeCompare(b.name || "");
        });
    }, [members, query]);

    const changeRole = async (member: Member, role: string) => {
        if (role === member.role) return;
        setBusyId(member.id);
        setError("");
        setBanner("");
        try {
            const res = await fetch("/api/admin/users/role", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userId: member.id, role}),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setError(typeof json?.error === "string" ? json.error : "Couldn't change that role.");
                return;
            }
            setBanner(`${member.name} is now ${role === "admin" ? "an admin" : `a ${role}`}.`);
            await load();
        } catch {
            setError("Couldn't change that role.");
        } finally {
            setBusyId(null);
        }
    };

    const counts = useMemo(() => {
        const c: Record<string, number> = {admin: 0, facilitator: 0, user: 0};
        for (const m of members ?? []) if (c[m.role] !== undefined) c[m.role] += 1;
        return c;
    }, [members]);

    return (
        <div>
            <AdminHeader
                eyebrow="People"
                title="Members"
                sub="Everyone with a Relate account, and what they can do. Role changes are written to the activity log."
            />

            {banner ? (
                <p className="mb-4 rounded-lg bg-gold-50 px-4 py-2.5 text-sm text-gold-700">{banner}</p>
            ) : null}
            {error ? (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            ) : null}

            {members ? (
                <div className="mb-5 flex flex-wrap gap-3">
                    {ROLES.map((r) => (
                        <div key={r} className="rounded-xl border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                {r}
                            </p>
                            <p className="text-lg font-black text-navy">{counts[r] ?? 0}</p>
                        </div>
                    ))}
                </div>
            ) : null}

            <div className="mb-4">
                <Field label="Search members">
                    <div className="relative">
                        <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Name, email or role…"
                            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-base text-gray-800 shadow-sm outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20 md:text-sm"
                        />
                    </div>
                </Field>
            </div>

            {visible === null ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center text-sm text-slate-gray">
                    Loading members…
                </p>
            ) : visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-alice-blue/40 py-12 text-center">
                    <LuUsers className="mx-auto mb-2 text-2xl text-slate-gray"/>
                    <p className="text-sm text-slate-gray">
                        {query ? "No members match that search." : "No members yet."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {visible.map((m) => {
                        // AuthProvider's user has no id, so match on email.
                        const isSelf = !!user?.email && user.email === m.email;
                        // Legacy rows may hold a role the role API can't set; show it
                        // so the select never renders blank.
                        const options =
                            ROLES.includes(m.role as never) || m.role === "member"
                                ? ROLES
                                : ([...ROLES, m.role] as string[]);
                        return (
                            <div
                                key={m.id}
                                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                            >
                                <div className="min-w-[12rem] flex-1">
                                    <p className="font-semibold text-navy">
                                        {m.name}
                                        {isSelf ? <span className="ml-2 text-xs font-medium text-cyan">(you)</span> : null}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-slate-gray">
                                        {m.email || "No email"}
                                        {m.createdAt
                                            ? ` · joined ${new Date(m.createdAt).toLocaleDateString(undefined, {
                                                  month: "short",
                                                  year: "numeric",
                                              })}`
                                            : ""}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge tone={ROLE_TONE[m.role] ?? "slate"}>{m.role}</Badge>
                                    <Select
                                        aria-label={`Role for ${m.name}`}
                                        value={m.role}
                                        disabled={busyId === m.id || isSelf}
                                        title={isSelf ? "You can't change your own role" : ROLE_HINT[m.role]}
                                        onChange={(e) => changeRole(m, e.target.value)}
                                        className="w-40"
                                    >
                                        {options.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="mt-6 flex items-start gap-2 rounded-xl bg-alice-blue/60 px-4 py-3 text-xs text-slate-gray">
                <LuShieldCheck className="mt-0.5 shrink-0"/>
                Only admins can open this page or change roles, and you can&rsquo;t change your own role — otherwise
                an admin could accidentally lock the whole team out.
            </p>
        </div>
    );
}
