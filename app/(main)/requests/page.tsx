import Link from "next/link";
import {
  LuArrowLeft,
  LuBaby,
  LuHeartHandshake,
  LuHouse,
  LuPiggyBank,
  LuSend,
  LuShirt,
  LuShieldCheck,
  LuSmartphone,
  LuUtensils,
} from "react-icons/lu";
import RequestAppCta from "@/components/RequestAppCta";

const PRIORITIES = [
  {
    icon: <LuHeartHandshake className={"text-2xl"} />,
    title: "Orphans",
    body: "Children who have lost one or both parents and need a caring hand.",
  },
  {
    icon: <LuHouse className={"text-2xl"} />,
    title: "Widows",
    body: "Women carrying a family alone after losing their partner.",
  },
  {
    icon: <LuBaby className={"text-2xl"} />,
    title: "Child-headed families",
    body: "Homes where children are raising children and leading the way.",
  },
  {
    icon: <LuHeartHandshake className={"text-2xl"} />,
    title: "A hard season",
    body: "Anyone walking through an emergency or a season that just will not lift.",
  },
];

const REQUEST_TYPES = [
  {
    icon: <LuPiggyBank className={"text-2xl"} />,
    title: "Financial help",
    body: "Emergency financial support, assessed case by case.",
  },
  {
    icon: <LuUtensils className={"text-2xl"} />,
    title: "Food relief",
    body: "Food parcels and meals when the table is empty.",
  },
  {
    icon: <LuShirt className={"text-2xl"} />,
    title: "School fees & uniforms",
    body: "Help keeping a child in school — fees, stationery and uniforms.",
  },
  {
    icon: <LuHouse className={"text-2xl"} />,
    title: "Childcare & family",
    body: "Childcare support and practical help for families.",
  },
  {
    icon: <LuHeartHandshake className={"text-2xl"} />,
    title: "Counselling",
    body: "Someone to walk with you through grief, fear or a hard place.",
  },
  {
    icon: <LuSend className={"text-2xl"} />,
    title: "Other needs",
    body: "If it is not listed here, tell us anyway — we will find the right help.",
  },
];

const STEPS = [
  {
    icon: <LuSmartphone className={"text-2xl"} />,
    title: "Download the app",
    body: "Get the free Relate app for Android and open Requests.",
  },
  {
    icon: <LuSend className={"text-2xl"} />,
    title: "Submit your request",
    body: "Tell us briefly what is happening and what you need.",
  },
  {
    icon: <LuShieldCheck className={"text-2xl"} />,
    title: "We review it",
    body: "A team member reads every request with respect and confidentiality.",
  },
  {
    icon: <LuHeartHandshake className={"text-2xl"} />,
    title: "We refer or help",
    body: "We connect you to the right support — or help directly where we can.",
  },
];

export default function RequestsPage() {
  return (
    <main className="min-h-screen bg-ghost-white">
      <section className="relative overflow-hidden bg-navy-dark">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(100deg, rgba(21,31,58,0.97) 0%, rgba(29,42,77,0.9) 45%, rgba(15,163,196,0.5) 78%, rgba(19,197,221,0.25) 100%), url(https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto max-w-6xl px-6 py-14 md:py-20">
          <Link
            href={"/"}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            <LuArrowLeft /> Back to home
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-light">
            Charity &amp; support
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">Requests</h1>
          <p className="mt-4 max-w-2xl text-white/80 leading-relaxed">
            Life is hard sometimes. When an emergency hits — or a season just will not lift — tell
            us. Financial help, food relief, school fees, childcare, counselling: we will review
            your request and refer you to the right help, or help directly.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-6 py-14 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-dark">
          Who we stand with
        </p>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-navy-dark">
          Mainly orphans, widows &amp; child-headed families
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRIORITIES.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <span className="text-cyan-dark">{item.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-navy-dark">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-dark">
            What you can request
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold text-navy-dark">
            Ask for what you need
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REQUEST_TYPES.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-ghost-white p-6">
                <span className="text-cyan-dark">{item.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-navy-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div className="rounded-2xl bg-navy text-white p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-light">
            Not sure?
          </p>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold">Share it anyway — we can help.</h2>
          <p className="mt-3 max-w-2xl text-white/80 leading-relaxed">
            You do not need to know if you qualify. If you are hanging on by your fingernails,
            tell us. We will review every request with respect — and we will either refer you to
            the right support or help directly.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-cyan-dark">{step.icon}</span>
                <span className="text-xs font-bold text-slate-400">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-navy-dark">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <RequestAppCta
        eyebrow="Sent through the Relate app"
        title="Make your request in the app"
        note="Download the free app, open Requests and tell us what is happening. A team member will review it and refer you to the right help or support you directly."
      />
    </main>
  );
}