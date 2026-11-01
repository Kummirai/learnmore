import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex flex-1 items-center justify-center bg-stage px-4 py-24"
    >
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-ink">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-gray">
          The link may be old or mistyped. Try the homepage, or get in touch and
          we&apos;ll point you in the right direction.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-soft"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:bg-alice-blue"
          >
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
