export default function Vision() {
  return (
    <section
      className={"reveal px-6 py-24 md:px-4 md:py-32"}
      style={{ background: "linear-gradient(150deg, #fff8e3 0%, #ffffff 70%)" }}
    >
      <div className={"mx-auto max-w-4xl text-center"}>
        <p
          className={
            "text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
          }
        >
          What Relate does
        </p>
        <h2
          className={
            "mx-auto mt-5 max-w-3xl text-3xl font-semibold leading-tight text-navy sm:text-4xl md:text-5xl"
          }
        >
          Our vision
        </h2>
        <p
          className={
            "mx-auto mt-6 max-w-xl text-base leading-relaxed text-navy/65 md:text-lg"
          }
        >
          To help you be self-reliant and sustainable &mdash; every program,
          interaction and resource is measured against that single outcome, a
          commitment to independence, not just activity.
        </p>
      </div>
    </section>
  );
}
