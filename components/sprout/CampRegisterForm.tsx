"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheck, FaUserLock } from "react-icons/fa";
import {
  LuLoaderCircle,
  LuLogIn,
  LuTent,
  LuCalendarCheck,
} from "react-icons/lu";
import { useAuth } from "@/components/AuthProvider";

const input =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan";
const label =
  "block text-xs font-bold uppercase tracking-wider text-slate-gray mb-1.5";

type Existing = {
  reference: string;
  camperName: string;
  status: string;
  edition: string;
  guardianName?: string;
};

function ageFromDob(dob: string): number | null {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

/**
 * Sprout Camp sign-up: camper details, guardian contact and consent, posted
 * to /api/camps/[slug]/register. Signed-out visitors get a sign-in prompt
 * that returns them here; a registration already on file replaces the form.
 */
export default function CampRegisterForm({
  campSlug,
  edition,
  fee,
  deadlineLabel,
}: {
  campSlug: string;
  edition: string;
  fee: string;
  deadlineLabel: string;
}) {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    camperName: "",
    dob: "",
    guardianName: "",
    guardianPhone: "",
    emergencyContact: "",
    medicalNotes: "",
    firstTime: true,
    consent: false,
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Existing | null>(null);
  const [existing, setExisting] = useState<Existing | null>(null);
  const [checked, setChecked] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch(
      `/api/camps/${encodeURIComponent(campSlug)}/register?edition=${encodeURIComponent(edition)}`,
    )
      .then((r) => (r.ok ? r.json() : { data: null }))
      .then((json) => {
        if (cancelled) return;
        const mine = json?.data;
        if (mine) {
          setExisting({
            reference: mine.reference,
            camperName: mine.camperName,
            status: mine.status,
            edition: mine.edition,
            guardianName: mine.guardianName,
          });
          setForm((f) => ({
            ...f,
            camperName: f.camperName || mine.camperName || "",
            guardianName: f.guardianName || mine.guardianName || "",
          }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, campSlug, edition]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.camperName.trim().length < 2)
      return setError("Please enter the camper's full name.");
    const age = ageFromDob(form.dob);
    if (age === null || age < 6 || age > 15)
      return setError("Campers are aged 6 to 15 — check the date of birth.");
    if (form.guardianName.trim().length < 2)
      return setError("Please enter a parent or guardian's name.");
    if (form.guardianPhone.replace(/\D/g, "").length < 9)
      return setError("Please enter a valid guardian phone number.");
    if (!form.consent)
      return setError(
        "A parent or guardian must consent before we can hold a place.",
      );

    setSending(true);
    try {
      const res = await fetch(
        `/api/camps/${encodeURIComponent(campSlug)}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            edition,
            camperName: form.camperName.trim(),
            dob: form.dob,
            guardianName: form.guardianName.trim(),
            guardianPhone: form.guardianPhone.trim(),
            emergencyContact: form.emergencyContact.trim() || undefined,
            medicalNotes: form.medicalNotes.trim() || undefined,
            firstTime: form.firstTime,
            consent: form.consent,
          }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (res.status === 401)
        throw new Error("Your sign-in has expired — please sign in again.");
      if (!res.ok) throw new Error(json?.error || "Something went wrong. Try again.");
      const data = json?.data;
      setDone({
        reference: data?.reference ?? "",
        camperName: data?.camperName ?? form.camperName.trim(),
        status: data?.status ?? "pending",
        edition: data?.edition ?? edition,
      });
      setExisting(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  if (loading || (user && !checked)) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-gray">
        <LuLoaderCircle className="animate-spin" /> Checking your session…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="size-12 rounded-full bg-alice-blue flex items-center justify-center mb-4">
          <LuLogIn className="text-xl text-cyan" />
        </div>
        <h3 className="font-bold text-navy mb-1">Sign in to register</h3>
        <p className="text-sm text-slate-gray mb-5">
          Camp places are tied to your Relate account so leaders can confirm
          details, payment and medical notes with the right family.
        </p>
        <Link
          href={`/signin?next=${encodeURIComponent(`/sprout/${campSlug}#register`)}`}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan text-white px-6 py-3 text-sm font-bold hover:bg-cyan-dark transition-colors"
        >
          <LuLogIn /> Sign in to register
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/60 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-11 rounded-full bg-white flex items-center justify-center shadow-sm">
            <FaCheck className="text-xl text-gold-700" />
          </div>
          <div>
            <h3 className="font-bold text-navy">
              Place held for {done.camperName}
            </h3>
            <p className="text-xs text-slate-gray">
              Reference <strong className="text-navy">{done.reference}</strong>{" "}
              · {done.edition}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Your registration is in — a camp leader will WhatsApp you to confirm
          the details and collect the {fee} deposit before {deadlineLabel}.
          Nothing else to do right now.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/sprout/honors"
            className="inline-flex items-center gap-2 rounded-lg border border-green-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:border-green-500 transition-colors"
          >
            See the honors they can earn →
          </Link>
          <Link
            href={`#itinerary`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:border-cyan transition-colors"
          >
            What happens at camp
          </Link>
        </div>
      </div>
    );
  }

  if (existing) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/60 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-11 rounded-full bg-white flex items-center justify-center shadow-sm">
            <LuTent className="text-xl text-gold-700" />
          </div>
          <div>
            <h3 className="font-bold text-navy">
              {existing.camperName} is registered
            </h3>
            <p className="text-xs text-slate-gray">
              Reference <strong className="text-navy">{existing.reference}</strong>{" "}
              · status {existing.status}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          A camp leader will confirm the {fee} deposit and send the kit list
          before {deadlineLabel}. Need to change something? Message the camp
          office and quote the reference.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-5">
        <LuCalendarCheck className="text-cyan text-xl" />
        <h3 className="font-bold text-navy">Register for Sprout Camp</h3>
      </div>

      <p className="rounded-lg bg-alice-blue border border-cyan/20 text-sm text-gray-700 px-4 py-3 mb-5">
        Camp fee <strong className="text-navy">{fee}</strong> · one deposit
        holds the place. Registrations close {deadlineLabel}.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="camp-name">
              Camper&apos;s full name
            </label>
            <input
              id="camp-name"
              required
              autoComplete="name"
              className={input}
              value={form.camperName}
              onChange={(e) => set("camperName", e.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="camp-dob">
              Date of birth
            </label>
            <input
              id="camp-dob"
              type="date"
              required
              className={input}
              value={form.dob}
              onChange={(e) => set("dob", e.target.value)}
            />
            <p className="mt-1 text-[11px] text-gray-400">Ages 6 – 15</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="camp-guardian">
              Parent / guardian name
            </label>
            <input
              id="camp-guardian"
              required
              autoComplete="name"
              className={input}
              value={form.guardianName}
              onChange={(e) => set("guardianName", e.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="camp-phone">
              Guardian phone / WhatsApp
            </label>
            <input
              id="camp-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="07X XXX XXXX"
              className={input}
              value={form.guardianPhone}
              onChange={(e) => set("guardianPhone", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="camp-emergency">
            Emergency contact{" "}
            <span className="normal-case font-normal text-gray-400">
              (someone we can reach if you can&apos;t be)
            </span>
          </label>
          <input
            id="camp-emergency"
            className={input}
            placeholder="Name and number"
            value={form.emergencyContact}
            onChange={(e) => set("emergencyContact", e.target.value)}
          />
        </div>

        <div>
          <label className={label} htmlFor="camp-medical">
            Medical, allergy or dietary notes{" "}
            <span className="normal-case font-normal text-gray-400">
              (optional)
            </span>
          </label>
          <textarea
            id="camp-medical"
            rows={3}
            className={input}
            placeholder="Medication, allergies, dietary needs, anything leaders should know…"
            value={form.medicalNotes}
            onChange={(e) => set("medicalNotes", e.target.value)}
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-gray-200 px-3.5 py-3 transition-colors hover:border-gray-300">
          <input
            type="checkbox"
            className="accent-cyan mt-0.5"
            checked={form.firstTime}
            onChange={(e) => set("firstTime", e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            This would be their first Sprout Camp
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-gray-200 px-3.5 py-3 transition-colors hover:border-gray-300">
          <input
            type="checkbox"
            required
            className="accent-cyan mt-0.5"
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            As parent or guardian, I consent to my child taking part in Sprout
            Camp and give permission for leaders to supervise activities and
            administer basic first aid.
          </span>
        </label>

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
          className="w-full inline-flex items-center justify-center gap-2 bg-cyan text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-cyan-dark transition-colors disabled:opacity-60"
        >
          {sending ? (
            <>
              <LuLoaderCircle className="animate-spin" /> Holding the place…
            </>
          ) : (
            <>
              Register for camp <FaCheck className="text-xs" />
            </>
          )}
        </button>

        <p className="flex items-center gap-2 text-[11px] text-slate-gray justify-center">
          <FaUserLock className="text-xs" />
          Details go straight to the camp team. You can ask us to cancel any
          time before {deadlineLabel}.
        </p>
      </div>
    </form>
  );
}
