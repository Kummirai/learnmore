"use client";

import {useState} from "react";
import {LuCheck, LuSend} from "react-icons/lu";
import {Button, Field, Input, Select, TextArea} from "@/components/admin/ui";

/** Mirrors VOLUNTEER_AREAS in backend/lib/volunteers.ts. */
const AREAS = [
    "Club Facilitation",
    "Children's Clubs",
    "Sports Coaching",
    "Season Guides & Content",
    "Education",
    "Prayer & Community Groups",
    "Photography & Design",
    "Social Media",
    "Website & IT",
    "Events & Logistics",
    "Admin & Data",
] as const;

const AVAILABILITY = [
    "A few hours a week",
    "A few hours a month",
    "Weekends only",
    "Event-based / occasional",
    "Flexible — happy to help where needed",
] as const;

type Errors = Partial<Record<"name" | "email" | "phone" | "areas" | "about", string>>;

export default function VolunteerApplyForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [area, setArea] = useState("");
    const [ageGroup, setAgeGroup] = useState("");
    const [about, setAbout] = useState("");
    const [availability, setAvailability] = useState<string>(AVAILABILITY[0]);
    const [areas, setAreas] = useState<string[]>([]);
    const [errors, setErrors] = useState<Errors>({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [serverError, setServerError] = useState("");

    const toggleArea = (value: string) => {
        setAreas((prev) =>
            prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value],
        );
    };

    const validate = (): Errors => {
        const next: Errors = {};
        if (!name.trim()) next.name = "Please tell us your name.";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
            next.email = "Please enter a valid email address.";
        }
        if (!phone.trim()) next.phone = "Please add a WhatsApp number.";
        if (areas.length === 0) next.areas = "Choose at least one area.";
        if (about.trim().length < 20) {
            next.about = "Tell us a little more (at least 20 characters).";
        }
        return next;
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const found = validate();
        setErrors(found);
        setServerError("");
        if (Object.keys(found).length > 0) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/volunteers", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    area: area.trim(),
                    ageGroup,
                    about: about.trim(),
                    availability,
                    areas,
                }),
            });
            const json = await res.json().catch(() => null);
            if (!res.ok) {
                setServerError(
                    typeof json?.error === "string" ? json.error : "Something went wrong. Please try again.",
                );
                return;
            }
            setDone(true);
        } catch {
            setServerError("Couldn't reach the server. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <div className="rounded-2xl border border-gold-200 bg-gold-50 p-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-gold-100">
                    <LuCheck className="text-2xl text-gold-700"/>
                </div>
                <h3 className="text-xl font-black text-navy">Thank you — we&rsquo;ve got it</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-gray">
                    Someone from the team will read your application and get back to you on the number you
                    gave us. We&apos;re glad you want to serve.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} noValidate className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-black tracking-tight text-navy">Apply to volunteer</h2>
            <p className="mt-1 text-sm text-slate-gray">
                Fill this in and a director will get in touch. No account needed.
            </p>

            {serverError ? (
                <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{serverError}</p>
            ) : null}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Thandi Mokoena"
                        autoComplete="name"
                    />
                    {errors.name ? <ErrorText>{errors.name}</ErrorText> : null}
                </Field>

                <Field label="Email">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        spellCheck={false}
                        autoCapitalize="none"
                        autoCorrect="off"
                    />
                    {errors.email ? <ErrorText>{errors.email}</ErrorText> : null}
                </Field>

                <Field label="WhatsApp number" hint="Include your country code.">
                    <Input
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+27 82 123 4567"
                        autoComplete="tel"
                    />
                    {errors.phone ? <ErrorText>{errors.phone}</ErrorText> : null}
                </Field>

                <Field label="Suburb or area">
                    <Input
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Soweto"
                    />
                </Field>

                <Field label="Age group">
                    <Select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                        <option value="">Prefer not to say</option>
                        <option value="16–21">16–21</option>
                        <option value="22–33">22–33</option>
                        <option value="34–45">34–45</option>
                        <option value="46+">46+</option>
                    </Select>
                </Field>

                <Field label="How much time can you give?">
                    <Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
                        {AVAILABILITY.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </Select>
                </Field>
            </div>

            <fieldset className="mt-5">
                <legend className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                    What would you like to help with?
                </legend>
                <div className="flex flex-wrap gap-2">
                    {AREAS.map((a) => {
                        const selected = areas.includes(a);
                        return (
                            <button
                                key={a}
                                type="button"
                                onClick={() => toggleArea(a)}
                                aria-pressed={selected}
                                className={`min-h-11 rounded-full border px-3.5 py-3 text-sm font-semibold transition ${
                                    selected
                                        ? "border-navy bg-navy text-white"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-cyan hover:bg-alice-blue"
                                }`}
                            >
                                {a}
                            </button>
                        );
                    })}
                </div>
                {errors.areas ? <ErrorText>{errors.areas}</ErrorText> : null}
            </fieldset>

            <div className="mt-5">
                <Field
                    label="About you"
                    hint="Tell us about yourself and why you want to join the Relate team."
                >
                    <TextArea
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="A few sentences about you, your skills, and what you'd like to do at Relate…"
                        className="min-h-[140px]"
                    />
                </Field>
                {errors.about ? <ErrorText>{errors.about}</ErrorText> : null}
            </div>

            <div className="mt-6">
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                    <LuSend/> {submitting ? "Sending…" : "Send my application"}
                </Button>
            </div>
        </form>
    );
}

function ErrorText({children}: {children: React.ReactNode}) {
    return <span role="alert" className="mt-1 block text-xs text-red-600">{children}</span>;
}
