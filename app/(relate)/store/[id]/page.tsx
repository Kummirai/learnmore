import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuChevronRight, LuShoppingBag } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import ProductPanel from "@/components/store/ProductPanel";
import { getStoreItemById, getStoreItems } from "@/lib/store";
import { STORE_ITEMS } from "@/constants/relate";

export function generateStaticParams() {
  return STORE_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getStoreItemById(id);
  if (!item) return { title: "Product Not Found · Relate Store" };
  return {
    title: `${item.name} · Relate Store`,
    description: item.blurb,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getStoreItemById(id);
  if (!item) notFound();

  const all = await getStoreItems();
  const related = all
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 4);
  const others = all.filter((i) => i.id !== item.id).slice(0, 4);

  return (
    <>
      <Navbar />
      <section className="flex-1 px-4 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <nav
            className="flex items-center gap-1.5 text-xs text-slate-gray mb-8 flex-wrap"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-navy transition-colors">
              Home
            </Link>
            <LuChevronRight className="text-[10px]" />
            <Link href="/store" className="hover:text-navy transition-colors">
              Store
            </Link>
            <LuChevronRight className="text-[10px]" />
            <Link
              href={`/store?category=${encodeURIComponent(item.category)}`}
              className="hover:text-navy transition-colors"
            >
              {item.category}
            </Link>
            <LuChevronRight className="text-[10px]" />
            <span className="text-navy font-semibold">{item.name}</span>
          </nav>

          <ProductPanel item={item} />

          {(related.length > 0 || others.length > 0) && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-navy mb-5">
                You may also like
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {(related.length > 0 ? related : others).map((r) => (
                  <Link key={r.id} href={`/store/${r.id}`}>
                    <div className="max-w-64">
                      <div className="group rounded-lg overflow-hidden bg-alice-blue">
                        {r.image ? (
                          <>
                            <img
                              className="group-hover:hidden rounded-lg aspect-square object-cover bg-alice-blue"
                              src={r.image}
                              alt={r.name}
                            />
                            <img
                              className="hidden group-hover:block rounded-lg aspect-square object-cover bg-alice-blue"
                              src={r.image}
                              alt=""
                            />
                          </>
                        ) : (
                          <div className="aspect-square flex items-center justify-center text-slate-gray">
                            <LuShoppingBag />
                          </div>
                        )}
                      </div>
                      <p className="text-sm mt-2 font-semibold text-navy">
                        {r.name}
                      </p>
                      <p className="text-lg font-bold text-cyan">
                        R{(r.offerPrice ?? r.price).toLocaleString("en-ZA")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            href="/store"
            className="inline-flex items-center gap-1.5 text-sm text-slate-gray hover:text-navy transition-colors"
          >
            <LuArrowLeft /> Back to all products
          </Link>
        </div>
      </section>
    </>
  );
}