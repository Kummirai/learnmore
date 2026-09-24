import Link from "next/link";
import { FaAndroid } from "react-icons/fa";
import {
  LuCircleCheck,
  LuHeart,
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
        tagline={"share the load — we stand with you"}
        description={
          "We would love to pray with you. Share a prayer request and our prayer team will pray for it through the six daily prayer moments. Every request is read, reviewed with care and kept confidential."
        }
        watermark={"Pray"}
        bgImage={"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80"}
        navbar={false}
        titleSize={"clamp(3.75rem, 12vw, 7.5rem)"}
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
              className={"inline-flex items-center gap-2 border border-white/25 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:border-white/60 transition-colors"}
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

      <RequestAppCta
        eyebrow="Sent through the Relate app"
        title="Share a prayer request in the app"
        note="Download the free app, open Prayer &amp; Requests and send us your request. Our prayer team will pray for it through every daily prayer moment."
      />
    </main>
  );
}