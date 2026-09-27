"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaCheck, FaCamera, FaExclamationTriangle } from "react-icons/fa";
import { LuArrowRight, LuLoaderCircle } from "react-icons/lu";
import {
  MAX_PER_POSITION,
  positionsForSport,
} from "@/constants/squads";
import { type RelateTeam } from "@/constants/relate";

type Counts = Record<string, { taken: number; capacity: number }>;

type Done = {
  id: string;
  position: string;
  positionCode: string;
  status: "active" | "waitlist";
  order: number;
  photoUrl: string;
};

const RELIGIONS = [
  "Christian",
  "Apostolic",
  "Pentecostal",
  "Catholic",
  "Baptist",
  "Methodist",
  "Evangelical",
  "Other",
];

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/pjpeg", "image/png", "image/webp", "image/avif"];

/**
 * Player registration for one squad: profile photo (stored in Supabase) plus
 * the details a coach needs to pick a side — position, height, dominant foot
 * and hand, religion. A position holds MAX_PER_POSITION players; past that the
 * applicant is queued as a waitlist entry rather than turned away.
 */
export default function PlayerRegistrationForm({
  team,
  defaultPosition = "",
}: {
  team: RelateTeam;
  defaultPosition?: string;
}) {
  const positions = useMemo(() => positionsForSport(team.sport), [team.sport]);

  const [counts, setCounts] = useState<Counts>({});
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [religion, setReligion] = useState("");
  const [position, setPosition] = useState(
    positions.some((p) => p.name === defaultPosition) ? defaultPosition : "",
  );
  const [foot, setFoot] = useState<"" | "left" | "right">("");
  const [hand, setHand] = useState<"" | "left" | "right">("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Places left per position, so nobody picks a full slot blind.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/sports/registrations?teamId=${encodeURIComponent(team.id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.counts) setCounts(data.counts);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [team.id]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const placeLabel = (positionName: string) => {
    const taken = counts[positionName]?.taken ?? 0;
    const capacity = counts[positionName]?.capacity ?? MAX_PER_POSITION;
    const left = Math.max(0, capacity - taken);
    if (left === 0) return "Full — joins the waiting list";
    return `${left} of ${capacity} places left`;
  };

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type)) {
      setError("Use a JPEG, PNG or WebP photo.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("That photo is over 4 MB — pick a smaller one.");
      return;
    }
    setError(null);
    setPhoto(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ageNum = Number.parseInt(age, 10);
    const heightNum = Number.parseInt(heightCm, 10);
    if (name.trim().length < 2) return setError("Enter the player's full name.");
    if (!Number.isFinite(ageNum) || ageNum < 4 || ageNum > 99)
      return setError("Enter a valid age.");
    if (!photo) return setError("Add a profile photo.");
    if (!Number.isFinite(heightNum) || heightNum < 80 || heightNum > 230)
      return setError("Enter a height between 80 cm and 230 cm.");
    if (!religion.trim()) return setError("Enter the player's religion.");
    if (!position) return setError("Choose the position you play.");
    if (!foot) return setError("Choose the stronger foot (right or left).");
    if (!hand) return setError("Choose the stronger hand (right or left).");
    if (phone.trim() && phone.replace(/\D/g, "").length < 9)
      return setError("Enter a valid phone number, or leave it empty.");

    setSending(true);
    try {
      const body = new FormData();
      body.set("clubSlug", team.clubSlug);
      body.set("teamId", team.id);
      body.set("name", name.trim());
      body.set("age", String(ageNum));
      if (gender) body.set("gender", gender);
      if (phone.trim()) body.set("phone", phone.trim());
      body.set("heightCm", String(heightNum));
      body.set("religion", religion.trim());
      body.set("position", position);
      body.set("foot", foot);
      body.set("hand", hand);
      body.set("photo", photo);

      const res = await fetch("/api/sports/registrations", {
        method: "POST",
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Registration failed. Try again.");
      }
      setDone(data as Done);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  const input =
    "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-3 md:py-2.5 text-base md:text-sm focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/40";
  const label =
    "block text-xs font-bold uppercase tracking-wider text-slate-gray mb-1.5";
  const sectionBadge =
    "text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-1";
  const choice =
    "flex-1 min-h-11 rounded-lg border px-3 py-3 text-[13px] sm:text-sm font-semibold text-center cursor-pointer transition";

  if (done) {
    const onSheet = done.status === "active";
    return (
      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <div className="size-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-5">
            <FaCheck className="text-2xl text-gold-700" />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cyan mb-2">
            Relate · {team.name}
          </p>
          <h1 className="text-3xl font-black tracking-tight text-navy mb-3">
            {onSheet ? "You’re on the team sheet" : "You’re in the queue"}
          </h1>
          <p className="text-sm text-slate-gray mb-6">
            {onSheet ? (
              <>
                Registered as{" "}
                <strong className="text-navy">
                  {done.position} ({done.positionCode})
                </strong>{" "}
                for {team.name} — #{done.order} in that position.
              </>
            ) : (
              <>
                <strong className="text-navy">{done.position}</strong> is full, so
                you&rsquo;re #{done.order} on the waiting list for {team.name}.
                We&rsquo;ll move you onto the sheet as soon as a place opens.
              </>
            )}
          </p>
          <div className="rounded-2xl border border-gray-100 bg-alice-blue p-4 text-left text-sm text-slate-gray mb-6">
            Your photo and details are saved. Coaches see the first registrants
            per position as the starting side — check the squad page to see where
            you land.
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/sports/${team.id}`}
              className="inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-navy-dark transition-colors"
            >
              View the squad <LuArrowRight />
            </Link>
            <Link
              href="/sports"
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-navy px-6 py-3 rounded-lg font-bold text-sm hover:bg-alice-blue transition-colors"
            >
              All teams
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 px-4 py-12 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-cyan mb-1">
            Relate · {team.sport} registration
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-2">
            Register for {team.name}
          </h2>
          <p className="text-sm text-slate-gray max-w-2xl">
            Pick your position, add a photo and the essentials — the first
            {team.sport === "Football" ? " 11" : " 7"} players per position make
            the team sheet, and every position holds up to{" "}
            {MAX_PER_POSITION} players (starter plus cover).
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className={sectionBadge}>1 · Profile photo</p>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative size-28 shrink-0 rounded-full bg-alice-blue border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-cyan transition-colors"
                aria-label="Choose a profile photo"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Profile photo preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex flex-col items-center gap-1 text-slate-gray">
                    <FaCamera className="text-xl" />
                    <span className="text-[10px] font-bold uppercase">Add photo</span>
                  </span>
                )}
              </button>
              <div className="flex-1 text-center sm:text-left">
                <p className={label}>Profile photo</p>
                <p className="text-sm text-slate-gray">
                  A clear head-and-shoulders shot. JPEG, PNG or WebP, up to 4 MB —
                  it is stored in Supabase and shown on your squad page.
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => onPhoto(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-navy underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-cyan-dark"
                >
                  {photo ? "Choose a different photo" : "Choose a photo"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className={sectionBadge}>2 · Player details</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  className={input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="e.g. Thabo Mokoena"
                  required
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
                  min={4}
                  max={99}
                  className={input}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 14"
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  className={input}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className={label} htmlFor="height">
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  inputMode="numeric"
                  min={80}
                  max={230}
                  className={input}
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="e.g. 162"
                  required
                />
              </div>
              <div>
                <label className={label} htmlFor="religion">
                  Religion
                </label>
                <input
                  id="religion"
                  className={input}
                  list="religions"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  placeholder="e.g. Christian"
                  required
                />
                <datalist id="religions">
                  {RELIGIONS.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="phone">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className={input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +27 82 000 0000"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className={sectionBadge}>3 · Position</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="position">
                  Position you play
                </label>
                <select
                  id="position"
                  className={`${input} disabled:opacity-60`}
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                >
                  <option value="">Choose your position…</option>
                  {positions.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.code}) — {placeLabel(p.name)}
                    </option>
                  ))}
                </select>
                {position && (
                  <p className="mt-2 text-xs text-slate-gray">
                    {placeLabel(position)}. First come, first picked — the earliest
                    {team.sport === "Football" ? " 11" : " 7"} per squad are shown
                    as the team.
                  </p>
                )}
              </div>

              <div>
                <span className={label}>Stronger foot</span>
                <div className="flex gap-2" role="group" aria-label="Stronger foot">
                  {(["right", "left"] as const).map((side) => (
                    <button
                      key={side}
                      type="button"
                      aria-pressed={foot === side}
                      onClick={() => setFoot(side)}
                      className={`${choice} ${
                        foot === side
                          ? "border-cyan bg-cyan/10 text-navy"
                          : "border-gray-200 text-slate-gray hover:border-gray-300"
                      }`}
                    >
                      {side === "right" ? "Right-footed" : "Left-footed"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={label}>Stronger hand</span>
                <div className="flex gap-2" role="group" aria-label="Stronger hand">
                  {(["right", "left"] as const).map((side) => (
                    <button
                      key={side}
                      type="button"
                      aria-pressed={hand === side}
                      onClick={() => setHand(side)}
                      className={`${choice} ${
                        hand === side
                          ? "border-cyan bg-cyan/10 text-navy"
                          : "border-gray-200 text-slate-gray hover:border-gray-300"
                      }`}
                    >
                      {side === "right" ? "Right-handed" : "Left-handed"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            >
              <FaExclamationTriangle className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <LuLoaderCircle className="animate-spin" /> Registering…
              </>
            ) : (
              <>
                Register for {team.name} <LuArrowRight />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
