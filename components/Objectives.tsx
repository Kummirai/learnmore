const objectives = [
  {
    title: "Help the less privileged",
    body: "We proactively identify and reach out to individuals and families facing systemic or circumstantial disadvantage.",
  },
  {
    title: "Provide mentoring",
    body: "We build one-on-one and group mentoring relationships that offer guidance, support and skill development.",
  },
  {
    title: "Attend to social needs",
    body: "We address the social determinants of well-being — food security, housing stability, educational access and emotional health.",
  },
  {
    title: "Guide to relevant authorities",
    body: "We act as a knowledgeable bridge, connecting people with government agencies, non-profits, healthcare providers and legal services.",
  },
];

export default function Objectives() {
  return (
    <section className={"reveal bg-white px-6 py-20 md:px-4 md:py-28"}>
      <div
        className={
          "mx-auto grid max-w-5xl gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16"
        }
      >
        <div className={"text-center md:text-left"}>
          <p
            className={
              "text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan"
            }
          >
            Our objectives
          </p>
          <h2
            className={
              "mt-4 text-2xl font-semibold text-navy md:text-3xl"
            }
          >
            What we set out to do
          </h2>
          <p
            className={
              "mx-auto mt-4 max-w-sm text-sm leading-relaxed text-navy/65 md:mx-0 md:text-base"
            }
          >
            Four commitments guide how we identify need and how we respond to
            it.
          </p>
        </div>

        <ol className={"reveal reveal-stagger divide-y divide-line"}>
          {objectives.map(({ title, body }, i) => (
            <li
              key={title}
              className={
                "stagger-item flex gap-4 py-5 first:pt-0 last:pb-0 sm:gap-6"
              }
            >
              <span
                className={
                  "pt-0.5 text-sm font-semibold tabular-nums text-cyan"
                }
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={"text-base font-semibold text-navy"}>{title}</h3>
                <p className={"mt-1.5 text-sm leading-relaxed text-navy/60"}>
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
