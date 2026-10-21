export default function Stats() {
  const stats = [
    { value: "7", label: "Clubs for every age" },
    { value: "60+", label: "Weekly programs" },
    { value: "360+", label: "Daily verses & prayers" },
    { value: "100%", label: "Free to join" },
  ];

  return (
    <section className={"reveal bg-tile px-4 py-24 md:py-32"}>
      <div
        className={
          "mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-12 text-center lg:grid-cols-4"
        }
      >
        {stats.map((stat) => (
          <div key={stat.label}>
            <p
              className={
                "text-5xl font-semibold tracking-tight text-cyan md:text-6xl"
              }
            >
              {stat.value}
            </p>
            <p className={"mt-2 text-[13px] text-navy/70"}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
