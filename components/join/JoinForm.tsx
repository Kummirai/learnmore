"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaChevronRight,
  FaPrayingHands,
  FaShieldAlt,
  FaUserLock,
} from "react-icons/fa";
import { LuArrowRight, LuBellRing, LuLoaderCircle, LuUsers } from "react-icons/lu";
import {
  MEMBER_STORAGE_KEY,
  membershipCookieString,
  type Membership,
} from "@/lib/membership";
import type { RelateTeam } from "@/constants/relate";
import { useClubs } from "@/lib/useClubs";
import { useSports } from "@/lib/useSports";

type YesNo = "" | "yes" | "no";

const JOIN_CLUB_SLUGS = [
  "sprout",
  "surge",
  "pulse",
  "prime",
  "anchor",
  "spark",
  "synergy",
  "sprout-kids",
  "sprout-tweens",
  "sprout-teens",
];

const INTEREST_OPTIONS = [
  "Football",
  "Netball",
  "Volleyball",
  "Reading & study guides",
  "Prayer & worship",
  "Events & outings",
  "Music, art & drama",
  "Mentoring",
  "Volunteering & helping out",
];

const YOUTH_CLUBS = ["surge", "pulse"];

const CLUB_AGE_RANGES: Record<string, { min: number; max: number; label: string }> = {
  sprout: { min: 6, max: 15, label: "6–15 yrs" },
  prime: { min: 33, max: 99, label: "33+ yrs" },
  "sprout-kids": { min: 6, max: 8, label: "6–8 yrs" },
  "sprout-tweens": { min: 9, max: 11, label: "9–11 yrs" },
  "sprout-teens": { min: 12, max: 15, label: "12–15 yrs" },
  surge: { min: 16, max: 21, label: "16–21 yrs" },
  pulse: { min: 21, max: 33, label: "21–33 yrs" },
};

const GATHERING_ORDER: { title: string; body: string }[] = [
  { title: "Opening prayer", body: "we hand the evening to God." },
  {
    title: "Monthly devotional review",
    body: "read this month's devotional before you come; we share what it spoke to us.",
  },
  { title: "Celebrations", body: "wins, milestones and testimonies go first." },
  {
    title: "Club & team review",
    body: "results, training, attendance and progress.",
  },
  {
    title: "Disciplinaries & matters",
    body: "behaviour concerns handled in love, not in the street.",
  },
  {
    title: "Registrations & roles",
    body: "new members welcomed, captains and helpers confirmed.",
  },
  { title: "Resolutions", body: "decisions agreed and goals set for the month ahead." },
  {
    title: "Notices & closing prayer",
    body: "dates and announcements, then prayer to send us out.",
  },
];

type Done = { id: string; reference?: string; status: string; nextSteps?: string };

function YesNoOption({
  question,
  opt,
  labelText,
  value,
  onChange,
}: {
  question: string;
  opt: "yes" | "no";
  labelText: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <label
      className={`flex min-h-11 items-center gap-2 rounded-lg border px-3.5 py-3 cursor-pointer transition-colors ${
        value === opt ? "border-cyan bg-alice-blue" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <input
        type="radio"
        name={question}
        className="accent-cyan"
        checked={value === opt}
        onChange={() => onChange(opt)}
      />
      <span className="text-sm text-navy">{labelText}</span>
    </label>
  );
}

function YesNoField({
  question,
  value,
  onChange,
}: {
  question: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-navy mb-2">{question}</p>
      <div className="flex gap-2">
        <YesNoOption question={question} opt="yes" labelText="Yes" value={value} onChange={onChange} />
        <YesNoOption question={question} opt="no" labelText="No" value={value} onChange={onChange} />
      </div>
    </div>
  );
}

export default function JoinForm({
  defaultClub = "",
  defaultTeam = "",
  member = null,
}: {
  defaultClub?: string;
  defaultTeam?: string;
  /** Known membership record (read from the cookie) — prefills the form. */
  member?: Membership | null;
}) {
  const {
    find: findClub,
    loading: clubsLoading,
    error: clubsError,
  } = useClubs();
  const { sports, loading: teamsLoading, error: teamsError } = useSports();
  const linkedTeam = defaultTeam ? (sports?.getTeam(defaultTeam) ?? null) : null;
  const initialClub = defaultClub || member?.clubSlug || "";
  const [clubSlug, setClubSlug] = useState(initialClub);
  const [teamId, setTeamId] = useState("");
  const [name, setName] = useState(member?.name ?? "");
  const [age, setAge] = useState(member?.age ?? "");
  const [gender, setGender] = useState(member?.gender ?? "");
  const [phone, setPhone] = useState(member?.phone ?? "");
  const [area, setArea] = useState(member?.area ?? "");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [parentConsent, setParentConsent] = useState(false);
  const [alcohol, setAlcohol] = useState<YesNo>("");
  const [smoking, setSmoking] = useState<YesNo>("");
  const [drugs, setDrugs] = useState<YesNo>("");
  const [sexuallyActive, setSexuallyActive] = useState<YesNo>("");
  const [interests, setInterests] = useState<string[]>(member?.interests ?? []);
  const [commitment, setCommitment] = useState(false);
  const [gathering, setGathering] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const prefilled = Boolean(member?.name);

  const ageNum = Number(age);
  const isYouthClub = YOUTH_CLUBS.includes(clubSlug);
  const isMinor = Number.isInteger(ageNum) && ageNum >= 6 && ageNum < 18;
  const ageRange = CLUB_AGE_RANGES[clubSlug];
  const ageFitsClub =
    !ageRange || (Number.isInteger(ageNum) && ageNum >= ageRange.min && ageNum <= ageRange.max);

  const clubs = useMemo(
    () =>
      JOIN_CLUB_SLUGS.map((slug) => findClub(slug)).filter(
        (c): c is NonNullable<typeof c> => Boolean(c),
      ),
    [findClub],
  );

  const teams = useMemo(
    () => (sports?.teams ?? []).filter((t) => t.clubSlug === clubSlug),
    [sports, clubSlug],
  );

  // A deep-linked team (?team=…) is adopted once the catalogue has loaded.
  useEffect(() => {
    if (!linkedTeam) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- adopts a URL deep link after the async sports catalogue arrives; there is no event handler to hook into
    setClubSlug((prev) => prev || linkedTeam.clubSlug);
  }, [linkedTeam]);

  useEffect(() => {
    if (!linkedTeam || teamId) return;
    if (clubSlug && clubSlug !== linkedTeam.clubSlug) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- adopts a URL deep link after the async sports catalogue arrives; there is no event handler to hook into
    setTeamId(linkedTeam.id);
  }, [linkedTeam, clubSlug, teamId]);

  const selectedClub = clubs.find((c) => c.slug === clubSlug);
  const selectedTeam = teams.find((t) => t.id === teamId);

  if (done) {
    const joinedTeam = Boolean(selectedTeam);
    return (
      <section className="flex-1 px-4 py-16 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <div className="mx-auto size-16 rounded-full flex items-center justify-center bg-gold-50 mb-5">
            <FaCheck className="text-3xl text-gold-700" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-navy mb-2">
            Welcome to {selectedClub?.name ?? "Relate"}
          </h2>
          <p className="text-sm text-slate-gray mb-6">
            Membership ID{" "}
            <span className="font-mono font-semibold text-navy">
              #{done.reference ?? done.id}
            </span>{" "}
            · <span className="font-semibold text-gold-700">Active member</span>
          </p>

          <div className="text-left rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-navy mb-4">You&rsquo;re all set</h3>
            <ol className="space-y-4 text-sm text-slate-gray">
              <li className="flex gap-3">
                <span className="shrink-0 size-6 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>
                  Your <strong className="text-navy">membership is active right now</strong>{" "}
                  — keep your membership ID; it&rsquo;s also on your membership
                  page.
                </span>
              </li>
              {joinedTeam && (
                <li className="flex gap-3">
                  <span className="shrink-0 size-6 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>
                    You&rsquo;re on the{" "}
                    <strong className="text-navy">{selectedTeam!.name}</strong> squad —
                    your name now shows on the team page with the rest of the members.
                  </span>
                </li>
              )}
              <li className="flex gap-3">
                <span className="shrink-0 size-6 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center text-xs font-bold">
                  {joinedTeam ? 3 : 2}
                </span>
                <span>
                  Your leader will get in touch with the time and venue for your
                  first {selectedClub?.name ?? "club"} gathering.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 size-6 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center text-xs font-bold">
                  {joinedTeam ? 4 : 3}
                </span>
                <span>
                  You&rsquo;re part of the{" "}
                  <strong className="text-navy">monthly Club Gathering</strong> — every
                  second Friday of the month, for fellowship, review and prayer.
                </span>
              </li>
            </ol>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/membership"
              className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-navy/90 transition-colors"
            >
              View my membership <LuArrowRight className="text-xs" />
            </Link>
            <Link
              href={joinedTeam ? `/sports/${selectedTeam!.id}` : `/${clubSlug}`}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-navy px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              {joinedTeam ? "Open my team page" : "Go to my club page"}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!clubSlug) return setError("Please choose your club.");
    if (!name.trim()) return setError("Please enter your full name.");
    if (!Number.isInteger(ageNum) || ageNum < 6 || ageNum > 99)
      return setError("Please enter a valid age (6–99).");
    if (ageRange && (ageNum < ageRange.min || ageNum > ageRange.max))
      return setError(
        `${selectedClub?.name ?? "This club"} is for ages ${ageRange.min}–${ageRange.max} — pick a club that fits your age.`,
      );
    if (!gender) return setError("Please select your gender.");
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 9 || phoneDigits.length > 15)
      return setError("Please enter a valid WhatsApp number.");
    if (isMinor && (!guardianName.trim() || guardianPhone.replace(/\D/g, "").length < 9))
      return setError(
        "Under 18s need a parent or guardian name and phone number.",
      );
    if (isMinor && !parentConsent)
      return setError("A parent or guardian must give consent for under 18s to join.");
    if (!alcohol || !smoking || !drugs)
      return setError("Please answer the three questions about your lifestyle.");
    if (isYouthClub && !sexuallyActive)
      return setError("Please answer the question about personal conduct.");
    if (!commitment)
      return setError(
        "Please accept the commitment to the Relate community standards.",
      );
    if (!gathering)
      return setError(
        "Please accept the monthly Club Gathering commitment.",
      );

    setSending(true);
    const payload = {
      clubSlug,
      clubName: selectedClub?.name,
      teamId,
      teamName: selectedTeam?.name,
      sport: selectedTeam?.sport,
      name: name.trim(),
      age: ageNum,
      gender,
      interests,
      phone: phone.trim(),
      area: area.trim() || undefined,
      guardian: isMinor ? { name: guardianName.trim(), phone: guardianPhone.trim() } : undefined,
      parentConsent: isMinor ? parentConsent : undefined,
      conduct: {
        alcohol,
        smoking,
        drugs,
        ...(isYouthClub ? { sexualActivity: sexuallyActive } : {}),
      },
      commitmentAccepted: commitment,
      clubGatheringAccepted: gathering,
    };

    fetch("/api/club-join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Something went wrong. Try again.");
        setDone(data);
        try {
          const saved: Membership = {
            name: name.trim(),
            age: String(ageNum),
            gender,
            phone: phone.trim(),
            area: area.trim(),
            clubSlug,
            clubName: selectedClub?.name,
            interests,
            reference: data.reference,
            teamId: teamId || undefined,
            teamName: selectedTeam?.name,
            sport: selectedTeam?.sport,
            id: data.id,
            status: data.status,
            joinedAt: new Date().toISOString(),
          };
          window.localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(saved));
          document.cookie = membershipCookieString(saved);
        } catch {
          // storage unavailable — registration still succeeded
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setSending(false));
  }

  const input =
    "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan";
  const label = "block text-xs font-bold uppercase tracking-wider text-slate-gray mb-1.5";
  const sectionBadge = "text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1";

  return (
    <section className="flex-1 px-4 py-12 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cyan mb-1">
            {selectedTeam ? "Relate · Join a Team" : "Relate · Join a Club"}
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-2">
            {selectedTeam ? `Join ${selectedTeam.name}` : "Register to join"}
          </h2>
          <p className="text-sm text-slate-gray max-w-2xl">
            {selectedTeam ? (
              <>
                Signing up for the{" "}
                <strong className="text-navy">{selectedTeam.name}</strong> squad
                ({selectedTeam.sport}) — one form, then you&rsquo;re on the team
                list straight away. It also creates your{" "}
                {selectedClub?.name ?? "Relate"} membership.
              </>
            ) : (
              <>
                Pick your club, tell us about yourself and we&rsquo;ll create your
                membership record. Later, joining a squad or an activity takes
                seconds — we already know the rest.
              </>
            )}
          </p>
          {prefilled && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-gold-200 bg-gold-50 px-3.5 py-2.5 text-sm text-gold-800">
              <FaCheck className="mt-0.5 shrink-0" />
              <span>
                Welcome back — we&rsquo;ve filled in what we already know.
                Check it over and complete only what&rsquo;s missing.
              </span>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className={sectionBadge}>1 · Club &amp; team</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="club">
                  Club
                </label>
                {clubsError && (
                  <p role="alert" className="text-xs text-red-600 mb-1">
                    {clubsError}
                  </p>
                )}
                <select
                  id="club"
                  required
                  className={input}
                  value={clubSlug}
                  disabled={clubsLoading}
                  onChange={(e) => {
                    setClubSlug(e.target.value);
                    setTeamId("");
                  }}
                >
                  <option value="">
                    {clubsLoading ? "Loading clubs…" : "Choose your club…"}
                  </option>
                  {clubs.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} · {c.group} ({c.ageRange})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="team">
                  Team (optional)
                </label>
                {teamsError && (
                  <p role="alert" className="text-xs text-red-600 mb-1">
                    {teamsError}
                  </p>
                )}
                <select
                  id="team"
                  className={`${input} disabled:opacity-60 disabled:cursor-not-allowed`}
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  disabled={!clubSlug || teams.length === 0 || teamsLoading}
                >
                  <option value="">
                    {!clubSlug
                      ? "Choose a club first…"
                      : teamsLoading
                        ? "Loading teams…"
                        : teams.length === 0
                        ? `No teams in ${selectedClub?.name ?? "this club"} yet`
                        : "Choose your team…"}
                  </option>
                  {teams.map((t: RelateTeam) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.sport})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedClub && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-gray bg-alice-blue rounded-lg px-3 py-2">
                <LuUsers className="text-cyan shrink-0" />
                <span>
                  {selectedClub.name} ·{" "}
                  {selectedTeam
                    ? selectedTeam.name
                    : teams.length
                      ? "choose a team below"
                      : "no squads yet — join one later"} ·
                  ages {ageRange?.label ?? "—"}.
                  {isYouthClub
                    ? " 18–21s in Surge and 21–33s in Pulse join as young adults with their own conduct standards below."
                    : " All members follow Relate's community standards."}
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className={sectionBadge}>2 · About you</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  autoComplete="name"
                  className={input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Thabo Mokoena"
                />
              </div>
              <div>
                <label className={label} htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={6}
                  max={99}
                  className={input}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 17"
                />
                {selectedClub && ageRange && (
                  <p
                    className={`mt-1 text-xs ${
                      ageFitsClub ? "text-slate-gray" : "font-semibold text-red-500"
                    }`}
                  >
                    {selectedClub.name} is for ages {ageRange.min}–{ageRange.max}.
                  </p>
                )}
              </div>
              <div>
                <label className={label} htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  required
                  className={input}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className={label} htmlFor="phone">
                  WhatsApp number
                </label>
                <input
                  id="phone"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className={input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 071 234 5678"
                />
              </div>
              <div>
                <label className={label} htmlFor="area">
                  Suburb / area <span className="normal-case font-normal">(optional)</span>
                </label>
                <input
                  id="area"
                  className={input}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Embalenhle"
                />
              </div>
            </div>

            {isMinor && (
              <div className="mt-5 rounded-xl bg-alice-blue border border-cyan/20 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-navy mb-3">
                  Parent / guardian
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label} htmlFor="guardianName">
                      Guardian name
                    </label>
                    <input
                      id="guardianName"
                      required
                      className={input}
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={label} htmlFor="guardianPhone">
                      Guardian phone
                    </label>
                    <input
                      id="guardianPhone"
                      required
                      className={input}
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                    />
                  </div>
                </div>
                <label className="mt-4 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={parentConsent}
                    onChange={(e) => setParentConsent(e.target.checked)}
                    className="mt-0.5 size-4 accent-cyan"
                  />
                  <span className="text-sm text-navy leading-relaxed">
                    As a parent or guardian, I consent to my child joining this
                    Relate club and taking part in its activities.
                  </span>
                </label>
              </div>
            )}

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className={label}>
                What are you interested in?{" "}
                <span className="font-normal normal-case tracking-normal text-gray-400">
                  (optional — pick any)
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => {
                  const on = interests.includes(opt);
                  return (
                    <label
                      key={opt}
                      className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-3 cursor-pointer transition-colors ${
                        on ? "border-cyan bg-alice-blue" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-cyan"
                        checked={on}
                        onChange={() =>
                          setInterests((cur) =>
                            on ? cur.filter((x) => x !== opt) : [...cur, opt],
                          )
                        }
                      />
                      <span className="text-sm text-navy">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className={sectionBadge}>3 · Community standards</p>
            <p className="text-sm text-slate-gray leading-relaxed mb-5">
              Relate is a faith-centred community. We believe you are at your
              best when you live free from drugs, alcohol and sexual immorality
              — and we walk with you, not judge you. Answer honestly so your
              leaders can walk with you well.
            </p>

            <div className="space-y-4">
              <YesNoField
                question="Do you currently drink alcohol?"
                value={alcohol}
                onChange={setAlcohol}
              />
              <YesNoField
                question="Do you currently smoke or vape (including hookah)?"
                value={smoking}
                onChange={setSmoking}
              />
              <YesNoField
                question="Do you currently use drugs (cannabis/weed, nyaope or other substances)?"
                value={drugs}
                onChange={setDrugs}
              />
              {isYouthClub && (
                <YesNoField
                  question="Are you currently involved in a sexual relationship outside marriage?"
                  value={sexuallyActive}
                  onChange={setSexuallyActive}
                />
              )}
            </div>

            <div className="mt-5 rounded-xl bg-navy text-white p-5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3">
                <FaShieldAlt className="text-cyan" /> Why we ask
              </p>
              <ul className="space-y-2.5 text-sm text-white/85 leading-relaxed list-disc list-inside">
                <li>
                  Alcohol and drugs damage health, money, family trust and
                  future opportunity — and they are the fastest route out of a
                  club, not into one.
                </li>
                <li>
                  God calls us to honour Him with our bodies:{" "}
                  <span className="italic text-white">
                    &ldquo;Do you not know that your bodies are temples of the
                    Holy Spirit?&rdquo;
                  </span>{" "}
                  (1 Corinthians 6:19).
                </li>
                {isYouthClub && (
                  <li>
                    Sex outside marriage carries real physical and emotional
                    risks and falls short of God&rsquo;s design for
                    relationships:{" "}
                    <span className="italic text-white">
                      &ldquo;Flee from sexual immorality&rdquo;
                    </span>{" "}
                    (1 Corinthians 6:18). Surge and Pulse members commit to
                    purity — and we support that walk.
                  </li>
                )}
              </ul>
            </div>

            <label className="mt-5 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={commitment}
                onChange={(e) => setCommitment(e.target.checked)}
                className="mt-0.5 size-4 accent-cyan"
              />
              <span className="text-sm text-navy leading-relaxed">
                I commit to abstaining from alcohol, smoking, drugs{" "}
                {isYouthClub
                  ? "and sexual relationships outside marriage "
                  : ""}
                while part of a Relate club, and to honouring the values of the
                community.
              </span>
            </label>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className={sectionBadge}>4 · Monthly Club Gathering</p>
            <p className="text-sm text-slate-gray leading-relaxed mb-5">
              Relate is a <strong className="text-navy">faith-based</strong> community. Every club
              and team comes together once a month — on the{" "}
              <strong className="text-navy">second Friday</strong> — for its Club Gathering:
              fellowship, review and prayer. Your club leader shares the exact time and venue.
            </p>

            <div className="rounded-xl bg-navy text-white p-5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3">
                <FaPrayingHands className="text-cyan" /> What happens at a Club Gathering
              </p>
              <ol className="grid gap-2.5 sm:grid-cols-2">
                {GATHERING_ORDER.map((item, i) => (
                  <li
                    key={item.title}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <span className="shrink-0 size-6 rounded-full bg-cyan/20 text-cyan flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed">
                      <span className="font-semibold text-white">{item.title}</span>{" "}
                      <span className="text-white/70">— {item.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {isMinor && (
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-gray">
                <LuBellRing className="text-cyan shrink-0" />
                Under 18s: your parent or guardian will be told about every gathering date.
              </p>
            )}

            <label className="mt-4 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={gathering}
                onChange={(e) => setGathering(e.target.checked)}
                className="mt-0.5 size-4 accent-cyan"
              />
              <span className="text-sm text-navy leading-relaxed">
                I understand every Relate club and team gathers on the second Friday of the month,
                and I commit to attending my club&rsquo;s monthly gathering.
              </span>
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-navy/90 transition-colors disabled:opacity-60"
          >
            {sending ? (
              <>
                <LuLoaderCircle className="animate-spin text-lg" />{" "}
                {selectedTeam ? "Joining…" : "Submitting…"}
              </>
            ) : (
              <>
                {selectedTeam ? `Join ${selectedTeam.name}` : "Submit my registration"}{" "}
                <FaChevronRight className="text-xs" />
              </>
            )}
          </button>

          <p className="flex items-center gap-2 text-[11px] text-slate-gray justify-center">
            <FaUserLock className="text-xs" />
            Your details go straight to Relate&rsquo;s club team. An honest
            answer never blocks your application — interview is about walking
            with you.
          </p>
        </form>
      </div>
    </section>
  );
}