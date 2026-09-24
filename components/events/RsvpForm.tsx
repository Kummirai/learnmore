"use client";

import Link from "next/link";
import { useState } from "react";
import { FaCheck, FaUserLock } from "react-icons/fa";
import {
  LuCalendarCheck,
  LuLoaderCircle,
  LuLogIn,
  LuUserPlus,
  LuUserMinus,
} from "react-icons/lu";
import { useAuth } from "@/components/AuthProvider";
import type { RelateEvent } from "@/app/(hub)/events/page";

const input =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-base md:text-sm focus:outline-none focus:border-cyan";
const label = "block text-xs font-bold uppercase tracking-wider text-slate-gray mb-1.5";

type Props = {
  event: RelateEvent;
  eventId: string;
  onUpdated?: (updated: RelateEvent) => void;
  onClose?: () => void;
};

export default function RsvpForm({ event, eventId, onUpdated, onClose }: Props) {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    dob: "",
    emergencyContact: "",
    notes: "",
    partner: false,
    partnerName: "",
    partnerPhone: "",
    partnerDob: "",
    partnerEmail: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (loading) {
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
        <h3 className="font-bold text-navy mb-1">Sign in to RSVP</h3>
        <p className="text-sm text-slate-gray mb-5">
          RSVPs are tied to your Relate account so you can get your ticket and
          the team can hold your place.
        </p>
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan text-white px-6 py-3 text-sm font-bold hover:bg-cyan-dark transition-colors"
        >
          <LuLogIn /> Sign in
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-11 rounded-full bg-white flex items-center justify-center shadow-sm">
            <FaCheck className="text-xl text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-navy">You&rsquo;re on the list</h3>
            <p className="text-xs text-slate-gray">
              {event.title ?? "This event"} ·{" "}
              {typeof event.attending === "number"
                ? `${event.attending} attending`
                : "see you there"}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          We&rsquo;ll confirm your RSVP in the chat.
          {event.fee
            ? ` Entry ${event.fee} is payable before the event — the team will follow up on payment, then issue your ticket.`
            : " You don't need to bring anything but yourself."}
        </p>
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (event.hasRsvpd) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/50 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-11 rounded-full bg-white flex items-center justify-center shadow-sm">
            <FaCheck className="text-xl text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-navy">You&rsquo;re going</h3>
            <p className="text-xs text-slate-gray">
              {event.title ?? "This event"} ·{" "}
              {typeof event.attending === "number"
                ? `${event.attending} attending`
                : "see you there"}
            </p>
          </div>
        </div>
        {!confirmCancel ? (
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-semibold"
          >
            <LuUserMinus /> Can&rsquo;t make it? Cancel my RSVP
          </button>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              This frees your seat (and your partner&rsquo;s, if you&rsquo;re
              bringing one).
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={cancelling}
                onClick={async () => {
                  setCancelling(true);
                  setError("");
                  try {
                    const res = await fetch(
                      `/api/community/events/${eventId}/rsvp`,
                      { method: "POST" },
                    );
                    const json = await res.json().catch(() => ({}));
                    if (res.status === 401)
                      throw new Error(
                        "Your sign-in has expired — please sign in again.",
                      );
                    if (!res.ok)
                      throw new Error(json?.error || "Something went wrong.");
                    const attending = json?.data?.attending;
                    onUpdated?.({
                      ...event,
                      hasRsvpd: false,
                      attending:
                        typeof attending === "number" ? attending : event.attending,
                    });
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setCancelling(false);
                  }
                }}
                className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-lg px-5 py-2.5 text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-60"
              >
                {cancelling ? (
                  <LuLoaderCircle className="animate-spin" />
                ) : (
                  <LuUserMinus />
                )}
                Yes, cancel my RSVP
              </button>
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="text-sm text-slate-gray hover:text-navy font-semibold"
              >
                Keep it
              </button>
            </div>
            {error && (
              <p className="mt-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.fullName.trim()) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      return setError("Please enter a valid email address.");
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 9 || phoneDigits.length > 15)
      return setError("Please enter a valid phone number.");
    if (form.partner && !form.partnerName.trim())
      return setError("Please enter your partner's full name.");
    if (form.partner && form.partnerPhone.replace(/\D/g, "").length < 9)
      return setError("Please enter your partner's phone number.");

    setSending(true);
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      dob: form.dob || undefined,
      emergencyContact: form.emergencyContact.trim() || undefined,
      notes: form.notes.trim() || undefined,
      bringingPartner: form.partner,
      partner: form.partner
        ? {
            fullName: form.partnerName.trim(),
            phone: form.partnerPhone.trim(),
            dob: form.partnerDob || undefined,
            email: form.partnerEmail.trim() || undefined,
          }
        : undefined,
    };
    try {
      const res = await fetch(`/api/community/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 401)
        throw new Error("Your sign-in has expired — please sign in again.");
      if (!res.ok) throw new Error(json?.error || "Something went wrong. Try again.");
      const attending = json?.data?.attending;
      onUpdated?.({
        ...event,
        hasRsvpd: true,
        attending:
          typeof attending === "number" ? attending : event.attending,
      });
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <LuCalendarCheck className="text-cyan text-xl" />
          <h3 className="font-bold text-navy">RSVP for this event</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close RSVP form"
            className="text-slate-gray hover:text-navy text-sm font-semibold"
          >
            Close
          </button>
        )}
      </div>

      {event.fee && (
        <p className="rounded-lg bg-alice-blue border border-cyan/20 text-sm text-gray-700 px-4 py-3 mb-5">
          Entry <strong className="text-navy">{event.fee}</strong>. Your seat is
          reserved when you RSVP — the team confirms payment with you before the
          event.
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className={label} htmlFor="rsvp-name">
            Full name
          </label>
          <input
            id="rsvp-name"
            required
            className={input}
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
        </div>

        <div>
          <label className={label} htmlFor="rsvp-email">
            Email
          </label>
          <input
            id="rsvp-email"
            type="email"
            required
            className={input}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="rsvp-phone">
              Phone / WhatsApp
            </label>
            <input
              id="rsvp-phone"
              required
              className={input}
              placeholder="07X XXX XXXX"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="rsvp-dob">
              Date of birth
              <span className="normal-case font-normal text-gray-400">
                {" "}
                (optional)
              </span>
            </label>
            <input
              id="rsvp-dob"
              type="date"
              className={input}
              value={form.dob}
              onChange={(e) => set("dob", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="rsvp-emergency">
            Emergency contact
            <span className="normal-case font-normal text-gray-400">
              {" "}
              (optional)
            </span>
          </label>
          <input
            id="rsvp-emergency"
            className={input}
            placeholder="Name and number"
            value={form.emergencyContact}
            onChange={(e) => set("emergencyContact", e.target.value)}
          />
        </div>

        <div>
          <label className={label} htmlFor="rsvp-notes">
            Anything we should know?
            <span className="normal-case font-normal text-gray-400">
              {" "}
              (optional)
            </span>
          </label>
          <textarea
            id="rsvp-notes"
            rows={3}
            className={input}
            placeholder="Dietary needs, accessibility, questions…"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-gray-200 px-3.5 py-3 transition-colors hover:border-gray-300">
          <input
            type="checkbox"
            className="accent-cyan mt-0.5"
            checked={form.partner}
            onChange={(e) => set("partner", e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            <LuUserPlus className="inline mr-1.5 text-cyan" />
            I&rsquo;m bringing a partner or friend — reserve two seats
          </span>
        </label>

        {form.partner && (
          <div className="rounded-lg border border-cyan/20 bg-alice-blue/60 p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="partner-name">
                  Partner&rsquo;s full name
                </label>
                <input
                  id="partner-name"
                  className={input}
                  value={form.partnerName}
                  onChange={(e) => set("partnerName", e.target.value)}
                />
              </div>
              <div>
                <label className={label} htmlFor="partner-phone">
                  Partner&rsquo;s phone
                </label>
                <input
                  id="partner-phone"
                  className={input}
                  value={form.partnerPhone}
                  onChange={(e) => set("partnerPhone", e.target.value)}
                />
              </div>
              <div>
                <label className={label} htmlFor="partner-dob">
                  Partner&rsquo;s date of birth
                </label>
                <input
                  id="partner-dob"
                  type="date"
                  className={input}
                  value={form.partnerDob}
                  onChange={(e) => set("partnerDob", e.target.value)}
                />
              </div>
              <div>
                <label className={label} htmlFor="partner-email">
                  Partner&rsquo;s email
                </label>
                <input
                  id="partner-email"
                  type="email"
                  className={input}
                  value={form.partnerEmail}
                  onChange={(e) => set("partnerEmail", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
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
              <LuLoaderCircle className="animate-spin text-lg" /> Reserving your
              place…
            </>
          ) : (
            <>
              Confirm my RSVP <FaCheck className="text-xs" />
            </>
          )}
        </button>

        <p className="flex items-center gap-2 text-[11px] text-slate-gray justify-center">
          <FaUserLock className="text-xs" />
          Your details go straight to Relate&rsquo;s events team. You can
          cancel your RSVP any time.
        </p>
      </div>
    </form>
  );
}