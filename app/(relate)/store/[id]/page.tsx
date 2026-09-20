import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuChevronRight } from "react-icons/lu";
import PageHero from "@/components/PageHero";
import OrderBox from "@/components/store/OrderBox";
import { STORE_ITEMS, getStoreItem } from "@/constants/relate";

export function generateStaticParams() {
    return STORE_ITEMS.map((item) => ({ id: item.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = getStoreItem(id);
    if (!item) notFound();

    const related = STORE_ITEMS.filter((i) => i.category === item.category && i.id !== item.id).slice(0, 4);
    const others = STORE_ITEMS.filter((i) => i.id !== item.id).slice(0, 4);

    return (
        <>
            <PageHero
                title={item.name}
                tagline={`${item.category} · Relate Store`}
                description={item.blurb}
                titleSize={"clamp(2.75rem, 8vw, 5.5rem)"}
                meta={[
                    { label: "Price", value: `R${item.price}` },
                    { label: "Category", value: item.category },
                    { label: "Ordering", value: "Via WhatsApp" },
                ]}
                actions={
                    <a
                        href={`/store/checkout?item=${item.id}`}
                        className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors"
                    >
                        Order this item →
                    </a>
                }
            />

            <section className="flex-1 px-4 py-12 bg-white">
                <div className="max-w-6xl mx-auto">
                    <nav className="flex items-center gap-1.5 text-xs text-slate-gray mb-8" aria-label="Breadcrumb">
                        <Link href="/store" className="hover:text-navy transition-colors">Store</Link>
                        <LuChevronRight className="text-[10px]" />
                        <Link href={`/store?category=${encodeURIComponent(item.category)}`} className="hover:text-navy transition-colors">
                            {item.category}
                        </Link>
                        <LuChevronRight className="text-[10px]" />
                        <span className="text-navy font-semibold">{item.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                        <div className="bg-navy rounded-2xl p-3 shadow-sm">
                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-2">{item.category}</p>
                            <h2 className="text-3xl font-black tracking-tight text-navy mb-2">{item.name}</h2>
                            <p className="text-3xl font-bold text-cyan mb-4">{`R${item.price.toLocaleString("en-ZA")}`}</p>
                            <p className="text-gray-600 leading-relaxed mb-6">{item.blurb}</p>
                            <ul className="space-y-2 text-sm text-gray-600 mb-8">
                                <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-cyan" /> Wears the Relate gold emblem</li>
                                <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-cyan" /> Every purchase funds Relate clubs &amp; programs</li>
                                <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-cyan" /> Order via WhatsApp — pay on delivery or EFT</li>
                            </ul>
                            <div className="mt-auto">
                                <OrderBox item={item} />
                            </div>
                        </div>
                    </div>

                    {(related.length > 0 || others.length > 0) && (
                        <div>
                            <h3 className="text-xl font-bold text-navy mb-5">You may also like</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {(related.length > 0 ? related : others).map((r) => (
                                    <Link
                                        key={r.id}
                                        href={`/store/${r.id}`}
                                        className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="aspect-square overflow-hidden bg-gray-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={r.image}
                                                alt={r.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-semibold text-gray-800 group-hover:text-cyan-dark transition-colors">{r.name}</p>
                                            <p className="text-xs text-slate-gray mt-0.5">{`R${r.price}`}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-10">
                        <Link href="/store" className="inline-flex items-center gap-1.5 text-sm text-slate-gray hover:text-navy transition-colors">
                            <LuArrowLeft /> Back to all products
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
