import Link from "next/link";
import PageHero from "@/components/PageHero";
import { READING_PLANS, READING_PLAN_CATEGORIES } from "@/constants/readingPlans";

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
                navbar={false}
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
                                            className="group rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="relative h-36 overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={plan.image}
                                                    alt={plan.title}
                                                    loading="lazy"
                                                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div
                                                    className="absolute inset-0"
                                                    style={{ background: `linear-gradient(160deg, transparent 30%, ${plan.gradient[0]}cc 100%)` }}
                                                />
                                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-bold text-navy">
                                                    {plan.days} days
                                                </span>
                                                <h3 className="absolute bottom-3 left-4 right-4 text-lg font-bold text-white leading-snug drop-shadow">
                                                    {plan.title}
                                                </h3>
                                            </div>
                                            <div className="flex flex-col flex-1 p-5">
                                                <p className="text-sm font-semibold text-cyan mb-1.5">{plan.tagline}</p>
                                                <p className="text-sm text-gray-600 leading-relaxed flex-1">{plan.description}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                                                    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-gray">
                                                        {plan.section}
                                                    </span>
                                                    <a
                                                        href={`https://wa.me/27782677436?text=${encodeURIComponent(`Hi RelateWorld! I'd like to start the ${plan.title} reading plan (${plan.days} days).`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-auto text-xs font-semibold text-cyan hover:text-cyan-dark transition-colors"
                                                    >
                                                        Start this plan →
                                                    </a>
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
