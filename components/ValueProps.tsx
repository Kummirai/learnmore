const points = [
  {
    title: "Skills for every season",
    body: "Life skills, mentoring and career guidance — school support and tuition, CV writing and financial literacy.",
  },
  {
    title: "A club for every age",
    body: "Children, young youth, singles, single parents, couples and families — from 6 to 60+, everyone finds their crew.",
  },
  {
    title: "A daily spiritual rhythm",
    body: "Six prayer times from dawn to evening, a verse for every day, and Bible reading guides for every age.",
  },
  {
    title: "Real community",
    body: "A WhatsApp group with weekly meetups — not a mailing list. Trained facilitators walk with you.",
  },
  {
    title: "Free to join, always",
    body: "Every club, program and prayer time is free. Sponsorship covers school fees, uniforms and meals for families who need a hand.",
  },
  {
    title: "Support when life gets hard",
    body: "Food relief, school fees, uniforms, childcare and counselling — ask for help and someone walks with you.",
  },
];

export default function ValueProps() {
  return (
    <section className={"reveal bg-stage px-4 py-24 md:py-36"}>
      <div className={"max-w-5xl mx-auto"}>
        <div className={"mb-12 max-w-2xl md:mb-16"}>
          <p
            className={
              "mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy/70"
            }
          >
            What Relate does
          </p>
          <h2 className={"text-4xl font-semibold text-navy md:text-5xl"}>
            Grow in every area of life
          </h2>
        </div>
        <div
          className={
            "grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {points.map((point) => (
            <div key={point.title} className={"border-t border-black/10 pt-5"}>
              <h3 className={"text-lg font-semibold text-navy"}>
                {point.title}
              </h3>
              <p className={"mt-2 text-[15px] leading-relaxed text-navy/70"}>
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
