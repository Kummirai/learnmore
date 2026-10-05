import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LuArrowLeft, LuChevronRight, LuShoppingBag } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import ProductPanel from "@/components/store/ProductPanel";
import { getStoreItemById, getStoreItems } from "@/lib/store";
import type { StoreItem } from "@/constants/relate";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let item: StoreItem | null;
  try {
    item = await getStoreItemById(id);
  } catch {
    return { title: "Store Unavailable · Relate Store" };
  }
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

  let all: StoreItem[];
  try {
    all = await getStoreItems();
  } catch {
    return (
      <>
        <Navbar />
        <section className="flex-1 px-4 py-12 bg-white">
          <div className="max-w-xl mx-auto text-center rounded-2xl border border-red-200 bg-red-50 px-6 py-14">
            <p className="text-base font-semibold text-red-700 mb-1">
              We couldn&rsquo;t load the store.
            </p>
            <p className="text-sm text-red-600 mb-5">
              The catalogue is unavailable right now — please try again in a
              moment.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-semibold">
              <a
                href={`/store/${id}`}
                className="text-red-700 hover:text-red-800 underline underline-offset-4 min-h-11 inline-flex items-center"
              >
                Try again
              </a>
              <Link
                href="/store"
                className="text-slate-gray hover:text-navy transition-colors min-h-11 inline-flex items-center"
              >
                Back to store
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const item = all.find((i) => i.id === id);
  if (!item) notFound();

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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(related.length > 0 ? related : others).map((r) => (
                  <Link key={r.id} href={`/store/${r.id}`}>
                    <div className="max-w-64">
                      <div className="group rounded-lg overflow-hidden bg-alice-blue">
                        {r.image ? (
                            <>
                                <Image
                                  className="group-hover:hidden rounded-lg aspect-square object-cover bg-alice-blue"
                                  src={r.image}
                                  alt={r.name}
                                  width={640}
                                  height={640}
                                />
                                <Image
                                  className="hidden group-hover:block rounded-lg aspect-square object-cover bg-alice-blue"
                                  src={r.image}
                                  alt=""
                                  width={640}
                                  height={640}
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
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-slate-gray hover:text-navy transition-colors"
          >
            <LuArrowLeft /> Back to all products
          </Link>
        </div>
      </section>
    </>
  );
}