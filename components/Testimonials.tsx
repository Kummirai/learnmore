import { IoStarSharp } from "react-icons/io5";

const testimonials = [
  {
    quote:
      "I joined Pulse to grow my network and stayed for the people. The wallet course changed how I handle money — I opened my first savings account and I'm finally building something.",
    name: "Lerato M.",
    role: "Pulse Member · Youth",
    initials: "LM",
  },
  {
    quote:
      "As a single mom, Anchor gave me more than support — it gave me a village. Free childcare during our meetups, food parcels in a hard month, and friends who actually understand.",
    name: "Nomsa K.",
    role: "Anchor Member · Single Parent",
    initials: "NK",
  },
  {
    quote:
      "My son counts down the days to Sprout club on Saturday. He's reading on his own now, and the leaders know every child by name. It's the highlight of his week.",
    name: "Sipho D.",
    role: "Sprout Parent · Children",
    initials: "SD",
  },
];

export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section className={"reveal bg-white px-4 py-24 md:py-36"}>
      <div className={"max-w-5xl mx-auto"}>
        <div className={"mb-12 text-center md:mb-16"}>
          <p
            className={
              "mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
            }
          >
            Testimonials
          </p>
          <h2 className={"text-3xl font-semibold text-navy md:text-4xl"}>
            What our members say
          </h2>
        </div>

        {/* Featured quote — the one big voice */}
        <figure className={"mx-auto max-w-3xl text-center"}>
          <div className={"mb-6 flex justify-center gap-1 text-gold-500"}>
            {[...Array(5)].map((_, j) => (
              <IoStarSharp key={j} />
            ))}
          </div>
          <blockquote
            className={
              "text-2xl font-medium leading-snug tracking-tight text-navy md:text-3xl"
            }
          >
            &ldquo;{featured.quote}&rdquo;
          </blockquote>
          <figcaption className={"mt-7 flex items-center justify-center gap-3"}>
            <span
              className={
                  "grid size-10 place-items-center rounded-full bg-cyan text-sm font-semibold text-navy"
              }
            >
              {featured.initials}
            </span>
            <span className={"text-left"}>
              <span className={"block text-sm font-semibold text-navy"}>
                {featured.name}
              </span>
              <span className={"block text-xs text-navy/70"}>
                {featured.role}
              </span>
            </span>
          </figcaption>
        </figure>

        {/* Two quieter voices */}
        <div className={"mt-12 grid grid-cols-1 gap-6 md:grid-cols-2"}>
          {rest.map((t) => (
            <div key={t.name} className={"rounded-3xl bg-tile p-7"}>
              <div className={"mb-4 flex gap-1 text-gold-500"}>
                {[...Array(5)].map((_, j) => (
                  <IoStarSharp key={j} />
                ))}
              </div>
              <p className={"text-[15px] leading-relaxed text-navy/80"}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className={"mt-6 flex items-center gap-3"}>
                <span
                  className={
                "grid size-10 place-items-center rounded-full bg-cyan text-sm font-semibold text-navy"
                  }
                >
                  {t.initials}
                </span>
                <span>
                  <span className={"block text-sm font-semibold text-navy"}>
                    {t.name}
                  </span>
                  <span className={"block text-xs text-navy/70"}>{t.role}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
