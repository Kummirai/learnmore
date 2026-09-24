"use client";

import { useMemo, useState } from "react";
import {
  FaCheck,
  FaChevronRight,
  FaShieldAlt,
  FaUserLock,
} from "react-icons/fa";
import { LuLoaderCircle, LuUsers } from "react-icons/lu";
import {
  getRelateClub,
  SPORTS_TEAMS,
  type RelateTeam,
} from "@/constants/relate";

type YesNo = "" | "yes" | "no";

const JOIN_CLUB_SLUGS = [
  "sprout-kids",
  "sprout-tweens",
  "sprout-teens",
  "surge",
  "pulse",
];

const YOUTH_CLUBS = ["surge", "pulse"];

const CLUB_AGE_RANGES: Record<string, { min: number; max: number; label: string }> = {
  "sprout-kids": { min: 6, max: 8, label: "6–8 yrs" },
  "sprout-tweens": { min: 9, max: 11, label: "9–11 yrs" },
  "sprout-teens": { min: 12, max: 15, label: "12–15 yrs" },
  surge: { min: 16, max: 21, label: "16–21 yrs" },
  pulse: { min: 21, max: 33, label: "21–33 yrs" },
};

type Done = { id: string; status: string; nextSteps?: string };

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
      className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 cursor-pointer transition-colors ${
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
}: {
  defaultClub?: string;
  defaultTeam?: string;
}) {
  const [clubSlug, setClubSlug] = useState(defaultClub);
  const [teamId, setTeamId] = useState(defaultTeam);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [parentConsent, setParentConsent] = useState(false);
  const [alcohol, setAlcohol] = useState<YesNo>("");
  const [smoking, setSmoking] = useState<YesNo>("");
  const [drugs, setDrugs] = useState<YesNo>("");
  const [sexuallyActive, setSexuallyActive] = useState<YesNo>("");
  const [commitment, setCommitment] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  const ageNum = Number(age);
  const isYouthClub = YOUTH_CLUBS.includes(clubSlug);
  const isMinor = Number.isInteger(ageNum) && ageNum >= 0 && ageNum < 18;
  const ageRange = CLUB_AGE_RANGES[clubSlug];
  const ageFitsClub =
    !ageRange || (Number.isInteger(ageNum) && ageNum >= ageRange.min && ageNum <= ageRange.max);

  const clubs = useMemo(
    () =>
      JOIN_CLUB_SLUGS.map((slug) => getRelateClub(slug)).filter(
        (c): c is NonNullable<typeof c> => Boolean(c),
      ),
    [],
  );

  const teams = useMemo(
    () => SPORTS_TEAMS.filter((t) => t.clubSlug === clubSlug),
    [clubSlug],
  );

  const selectedClub = clubs.find((c) => c.slug === clubSlug);
  const selectedTeam = teams.find((t) => t.id === teamId);

  if (done) {
    return (
      <section className="flex-1 px-4 py-16 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <div className="mx-auto size-16 rounded-full flex items-center justify-center bg-emerald-50 mb-5">
            <FaCheck className="text-3xl text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-navy mb-2">
            Application received
          </h2>
          <p className="text-sm text-slate-gray mb-6">
            Reference{" "}
            <span className="font-mono font-semibold text-navy">
              #{done.id}
            </span>{" "}
            · status:{" "}
            <span className="font-semibold text-cyan">pending interview</span>
          </p>

          <div className="text-left rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-navy mb-4">What happens next</h3>
            <ol className="space-y-4 text-sm text-slate-gray">
              <li className="flex gap-3">
                <span className="shrink-0 size-6 rounded-full bg-alice-blue text-cyan flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>
                  A <strong className="text-navy">chaplain interviews you</strong>{" "}
                  — a short chat in person or on a call, so we get to know you
                  and can support you well.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 size-6 rounded-full bg-alice-blue text-cyan flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>
                  The chaplain confirms your place — you&rsquo;ll be{" "}
                  <strong className="text-navy">accepted</strong> or given warm,
                  honest guidance on next steps.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 size-6 rounded-full bg-alice-blue text-cyan flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>
                  You&rsquo;re welcomed into{" "}
                  <strong className="text-navy">
                    {selectedClub?.name ?? "your selected club"}
                  </strong>{" "}
                  — training, matches and your club&rsquo;s community.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!clubSlug) return setError("Please choose your club.");
    if (!teamId) return setError("Please choose the team you'd like to join.");
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
      })
      .catch((err) => setError(err.message))
      .finally(() => setSending(false));
  }

  const input =
    "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-base md:text-sm focus:outline-none focus:border-cyan";
  const label = "block text-xs font-bold uppercase tracking-wider text-slate-gray mb-1.5";
  const sectionBadge = "text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1";

  return (
    <section className="flex-1 px-4 py-12 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1">
            Relate · Join a Team
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-2">
            Register to join
          </h2>
          <p className="text-sm text-slate-gray max-w-2xl">
            Pick your club and squad, tell us about yourself, then complete a
            short chaplain interview before your place is confirmed.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className={sectionBadge}>1 · Club &amp; team</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="club">
                  Club
                </label>
                <select
                  id="club"
                  required
                  className={input}
                  value={clubSlug}
                  onChange={(e) => {
                    setClubSlug(e.target.value);
                    setTeamId("");
                  }}
                >
                  <option value="">Choose your club…</option>
                  {clubs.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} · {c.group} ({c.ageRange})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="team">
                  Team {clubSlug ? "(optional)" : ""}
                </label>
                <select
                  id="team"
                  required
                  className={input}
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  disabled={!clubSlug}
                >
                  <option value="">Choose your team…</option>
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
                  {selectedClub.name} · {selectedTeam ? selectedTeam.name : "choose a team below"} ·
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
                    Relate team and taking part in its activities.
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className={sectionBadge}>3 · Community standards</p>
            <p className="text-sm text-slate-gray leading-relaxed mb-5">
              Relate is a faith-centred community. We believe you are at your
              best when you live free from drugs, alcohol and sexual immorality
              — and we walk with you, not judge you. Answer honestly so your
              chaplain can support you well.
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

          {error && (
            <p className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
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
                <LuLoaderCircle className="animate-spin text-lg" /> Submitting…
              </>
            ) : (
              <>
                Submit my registration <FaChevronRight className="text-xs" />
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