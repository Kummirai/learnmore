import Link from "next/link";
import {
  LuArrowLeft,
  LuCircleCheck,
  LuHeart,
  LuSend,
  LuShieldCheck,
  LuSmartphone,
} from "react-icons/lu";
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
      <section className="relative overflow-hidden bg-navy-dark">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(100deg, rgba(21,31,58,0.97) 0%, rgba(29,42,77,0.9) 45%, rgba(15,163,196,0.5) 78%, rgba(19,197,221,0.25) 100%), url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80)",
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
            Prayer &amp; Requests
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-white">Prayer Requests</h1>
          <p className="mt-4 max-w-2xl text-white/80 leading-relaxed">
            We would love to pray with you. Share a prayer request and our prayer team will stand
            with you through the six daily prayer moments. Every request is read, reviewed with
            care and kept confidential.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-6 py-14 md:py-20">
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