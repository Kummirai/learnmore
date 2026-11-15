const stats = [
  { value: "7", label: "Clubs for every age" },
  { value: "60+", label: "Weekly programs" },
  { value: "360+", label: "Daily verses & prayers" },
  { value: "100%", label: "Free to join" },
];

export default function Stats() {
  return (
    <section
      className={
        "reveal relative overflow-hidden bg-navy px-6 py-20 md:px-4 md:py-24"
      }
    >
      <div
        aria-hidden
        className={
          "pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-cyan/15 blur-3xl"
        }
      />
      <div
        aria-hidden
        className={
          "pointer-events-none absolute -bottom-32 -right-20 size-80 rounded-full bg-gold-300/10 blur-3xl"
        }
      />

      <div className={"relative mx-auto max-w-6xl"}>
        <p
          className={
            "text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-light"
          }
        >
          Relate at a glance
        </p>

        <div
          className={
            "reveal reveal-stagger mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4"
          }
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={
                "stagger-item bg-navy px-4 py-9 text-center sm:px-6 sm:py-11"
              }
            >
              <p
                className={
                  "bg-gradient-to-b from-white to-cyan-light bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl"
                }
              >
                {stat.value}
              </p>
              <p
                className={
                  "mt-3 text-[13px] leading-snug text-white/60"
                }
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
