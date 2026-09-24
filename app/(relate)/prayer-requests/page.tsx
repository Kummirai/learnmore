import Link from "next/link";
import { FaAndroid } from "react-icons/fa";
import {
  LuBookOpen,
  LuCircleCheck,
  LuHandHeart,
  LuHeart,
  LuHeartHandshake,
  LuSend,
  LuShieldCheck,
  LuSmartphone,
} from "react-icons/lu";
import PageHero from "@/components/PageHero";
import RequestAppCta from "@/components/RequestAppCta";

const STEPS = [
  {
    icon: <LuSmartphone className={"text-2xl"} />,
    title: "Download the app",
    body: "Get the free Relate app for Android and open Prayer Requests under Prayer.",
  },
  {
    icon: <LuSend className={"text-2xl"} />,
    title: "Share your request",
    body: "A need, a person, a season — write it simply. It goes straight to our prayer team.",
  },
  {
    icon: <LuHeart className={"text-2xl"} />,
    title: "We pray with you",
    body: "Your request is prayed for through the six daily prayer moments.",
  },
  {
    icon: <LuShieldCheck className={"text-2xl"} />,
    title: "We follow up",
    body: "Where it helps, someone reaches back out to you with care.",
  },
];

export default function PrayerRequestsPage() {
  return (
    <main className="min-h-screen bg-ghost-white">
      <PageHero
        title={"Prayer Requests"}
        mobileTitle={"Prayers"}
        tagline={"share the load — we stand with you"}
        description={
          "We would love to pray with you. Share a prayer request and our prayer team will pray for it through the six daily prayer moments. Every request is read, reviewed with care and kept confidential."
        }
        watermark={"Pray"}
        bgImage={"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80"}
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
              href={"#how-it-works"}
              className={"inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/20 hover:border-white/60 transition-colors"}
            >
              How it works
            </a>
          </>
        }
        meta={[
          { label: "Prayer team", value: "Reads every request" },
          { label: "Confidential", value: "Always" },
          { label: "Daily moments", value: "6" },
        ]}
        metaEnd={
          <Link
            href={"/prayer"}
            className={"inline-flex items-center gap-2 font-medium text-white hover:text-cyan-light transition-colors"}
          >
            <span className={"text-[11px] uppercase tracking-widest text-white/70"}>
              Prayer &amp; Requests
            </span>
            Today&apos;s Prayer Times →
          </Link>
        }
      />

      <section id="how-it-works" className="container mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-cyan-dark">{step.icon}</span>
                <span className="text-xs font-bold text-slate-400">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-navy-dark">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-cyan-dark/20 bg-alice-blue p-6 max-w-3xl">
          <LuCircleCheck className="text-2xl shrink-0 text-cyan-dark mt-0.5" />
          <p className="text-sm text-navy-dark leading-relaxed">
            <span className="font-semibold">You are never alone in it.</span> Names and requests
            stay within the prayer team — nothing is shared publicly. If you would rather speak to
            someone directly, use the WhatsApp option below and we will point you to a team member.
          </p>
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
                &ldquo;Come to me, all you who are weary and burdened, and I will give you
                rest.&rdquo;
              </p>
              <footer className="mt-2 text-xs font-semibold uppercase tracking-widest text-cyan-light">
                Matthew 11:28
              </footer>
            </blockquote>
            <div className="h-px bg-white/15" />
            <blockquote>
              <p className="text-lg md:text-xl font-medium italic leading-relaxed">
                &ldquo;Pray for one another, so that you may be healed.&rdquo;
              </p>
              <footer className="mt-2 text-xs font-semibold uppercase tracking-widest text-cyan-light">
                James 5:16
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <span className="text-cyan-dark">
              <LuHandHeart className="text-2xl" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-navy-dark">Need prayer?</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Share it in the app. It stays confidential and is lifted through the six daily
              prayer moments.
            </p>
            <a
              href={"/relate-app.apk"}
              download
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-dark hover:underline"
            >
              Send your request <span aria-hidden>→</span>
            </a>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <span className="text-cyan-dark">
              <LuHeartHandshake className="text-2xl" />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-navy-dark">Want to pray?</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Join the prayer team and stand with families through hard seasons.
            </p>
            <a
              href={`https://wa.me/27782677436?text=${encodeURIComponent(
                "Hi RelateWorld! I'd like to join the prayer team.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-dark hover:underline"
            >
              Join the prayer team <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      <RequestAppCta
        eyebrow="Sent through the Relate app"
        title="Share a prayer request in the app"
        note="Download the free app, open Prayer &amp; Requests and send us your request. Our prayer team will pray for it through every daily prayer moment."
      />
    </main>
  );
}