import { FaAndroid } from "react-icons/fa";
import {
  LuBaby,
  LuBookOpen,
  LuHandHeart,
  LuHeartHandshake,
  LuHouse,
  LuPiggyBank,
  LuSend,
  LuShieldCheck,
  LuSmartphone,
  LuUtensils,
} from "react-icons/lu";
import PageHero from "@/components/PageHero";
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
      <PageHero
        title={"Requests"}
        tagline={"share it — we can help"}
        description={
          "Life is hard sometimes. When an emergency hits — or a season just will not lift — tell us. Financial help, food relief, childcare, counselling and more. We review every request and refer you to the right help, or help directly."
        }
        watermark={"Care"}
        bgImage={"https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80"}
        titleSize={"clamp(4.8rem, 11vw, 7.5rem)"}
        actions={
          <>
            <a
              href={"/relate-app.apk"}
              download
              className={"inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"}
            >
              <FaAndroid /> Download the app
            </a>
            <a
              href={"#what-you-can-request"}
              className={"inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/20 hover:border-white/60 transition-colors"}
            >
              What you can request
            </a>
          </>
        }
        meta={[
          { label: "Main priority", value: "Orphans & widows" },
          { label: "Every request", value: "Reviewed" },
          { label: "Response", value: "Refer or help" },
        ]}
        metaEnd={
          <a
            href={"#who-we-stand-with"}
            className={"inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"}
          >
            <span className={"text-[11px] uppercase tracking-widest text-white/70"}>
              Charity &amp; support
            </span>
            Who we stand with →
          </a>
        }
      />

      <section id="who-we-stand-with" className="container mx-auto max-w-6xl px-6 py-14 md:py-16">
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

      <section id="what-you-can-request" className="bg-white py-14 md:py-16">
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

      <section className="container mx-auto max-w-6xl px-6 pb-14 md:pb-16">
        <div className="rounded-2xl bg-navy text-white p-8 md:p-10">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-light">
            <LuBookOpen /> Encouragement
          </p>
          <div className="mt-5 space-y-5">
            <blockquote>
              <p className="text-lg md:text-xl font-medium italic leading-relaxed">
                &ldquo;Carry each other&rsquo;s burdens, and in this way you will fulfil the law
                of Christ.&rdquo;
              </p>
              <footer className="mt-2 text-xs font-semibold uppercase tracking-widest text-cyan-light">
                Galatians 6:2
              </footer>
            </blockquote>
            <div className="h-px bg-white/15" />
            <blockquote>
              <p className="text-lg md:text-xl font-medium italic leading-relaxed">
                &ldquo;Religion that God our Father accepts as pure and faultless is this: to
                look after orphans and widows in their distress.&rdquo;
              </p>
              <footer className="mt-2 text-xs font-semibold uppercase tracking-widest text-cyan-light">
                James 1:27
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <span className="text-cyan-dark">
              <LuHandHeart className="text-2xl" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-navy-dark">Need help?</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Ask. Tell us what is happening — we read every request and either refer you to the
              right support or help directly.
            </p>
            <a
              href={"#what-you-can-request"}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-dark hover:underline"
            >
              See what you can request <span aria-hidden>→</span>
            </a>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <span className="text-cyan-dark">
              <LuHeartHandshake className="text-2xl" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-navy-dark">Able to help?</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Give, volunteer or refer someone in need. Many hands carry the load — every bit
              counts.
            </p>
            <a
              href={`https://wa.me/27782677436?text=${encodeURIComponent(
                "Hi RelateWorld! I'd like to help with requests — giving, volunteering or making a referral.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-dark hover:underline"
            >
              Talk to the team <span aria-hidden>→</span>
            </a>
          </div>
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