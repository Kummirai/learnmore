import Link from "next/link";
import type { Metadata } from "next";
import { FaBookOpen } from "react-icons/fa";
import PageHero from "@/components/PageHero";
import { READING_PLANS, READING_PLAN_CATEGORIES } from "@/constants/readingPlans";

export const metadata: Metadata = {
  title: "Reading Plans",
  description:
    "Choose a Bible reading plan — from a month in the Psalms to the whole Bible in a year — with a verse, a read and a prayer for every day.",
  alternates: { canonical: "/plans" },
};

export default function ReadingPlansPage() {
    return (
        <>
            <PageHero
                title={"Reading Plans"}
                tagline={"A verse, a read and a prayer for every day"}
                description={
                    "Choose a plan, read with your club, and build a daily rhythm in the Word — from a month in the Psalms to the whole Bible in a year."
                }
                watermark={"21"}
                bgImage={
                    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&q=80"
                }
                meta={[
                    { label: "Plans", value: READING_PLANS.length },
                    { label: "Categories", value: READING_PLAN_CATEGORIES.length },
                    { label: "Cost", value: "Free" },
                ]}
                actions={
                    <Link
                        href="/#download"
                        className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                    >
                        Read daily in the app →
                    </Link>
                }
            />

            <section className="flex-1 px-4 py-12 bg-white">
                <div className="max-w-6xl mx-auto">
                    {/* Category jump links */}
                    <div className="flex flex-wrap gap-2 mb-12">
                        {READING_PLAN_CATEGORIES.map((cat) => (
                            <a
                                key={cat}
                                href={`#${cat.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-navy bg-alice-blue hover:bg-ice-blue px-4 py-2 rounded-full transition-colors"
                            >
                                {cat}
                                <span className="text-slate-gray">{READING_PLANS.filter((p) => p.category === cat).length}</span>
                            </a>
                        ))}
                    </div>

                    {READING_PLAN_CATEGORIES.map((category) => {
                        const plans = READING_PLANS.filter((p) => p.category === category);
                        if (plans.length === 0) return null;
                        return (
                            <div key={category} id={category.toLowerCase().replace(/[^a-z]+/g, "-")} className="scroll-mt-24 mb-14">
                                <div className="flex items-baseline gap-3 mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-navy">{category}</h2>
                                    <span className="text-sm text-slate-gray">{plans.length} plans</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.slug}
                                            className="group overflow-hidden flex flex-col hover:-translate-y-1.5 transition-all duration-300"
                                        >
                                            {/* Cover */}
                                            <div className="relative h-56 overflow-hidden bg-alice-blue">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={plan.image}
                                                    alt={plan.title}
                                                    loading="lazy"
                                                    className="size-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                {/* Light scrim at the bottom only, so the title stays readable without hiding the photo */}
                                                <div
                                                    className="absolute inset-0"
                                                    style={{ background: "linear-gradient(180deg, transparent 40%, rgba(21,31,58,0.82) 100%)" }}
                                                />
                                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-navy">
                                                    {plan.days} days
                                                </span>
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1">
                                                        {plan.section}
                                                    </p>
                                                    <h3 className="text-xl font-black tracking-tight text-white leading-tight">
                                                        {plan.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="flex flex-col flex-1 p-5">
                                                <p className="text-sm font-bold mb-1.5" style={{ color: plan.gradient[0] }}>
                                                    {plan.tagline}
                                                </p>
                                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
                                                    {plan.description}
                                                </p>
                                                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                                                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                                        {plan.category}
                                                    </span>
                                                    <Link
                                                        href={`/plans/${plan.slug}`}
                                                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white transition hover:brightness-110 shrink-0"
                                                        style={{ backgroundColor: plan.gradient[0] }}
                                                    >
                                                        <FaBookOpen className="text-sm" /> Start plan
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
