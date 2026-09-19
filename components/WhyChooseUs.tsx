import { LuCoins, LuMapPin, LuSun, LuMusic } from "react-icons/lu";

export default function WhyChooseUs() {
  const points = [
    {
      icon: <LuCoins className={"text-4xl text-cyan"} />,
      title: "Affordable Fees",
      description:
        "Quality education at fees that work for families. We offer payment plans and sibling discounts.",
    },
    {
      icon: <LuMapPin className={"text-4xl text-cyan"} />,
      title: "Convenient Location",
      description:
        "Centrally located with easy access and safe drop-off zones for busy parents.",
    },
    {
      icon: <LuSun className={"text-4xl text-cyan"} />,
      title: "Aftercare Program",
      description:
        "Structured after-school care with homework supervision, snacks, and fun activities.",
    },
    {
      icon: <LuMusic className={"text-4xl text-cyan"} />,
      title: "Extracurriculars",
      description:
        "Chess, choir, sports, art, and more — every child finds their passion beyond the classroom.",
    },
  ];

  return (
    <section className={"py-16 md:py-24 bg-alice-blue px-4"}>
      <div className={"max-w-6xl mx-auto"}>
        <div className={"text-center mb-12 md:mb-16"}>
          <h4 className={"text-cyan font-medium mb-3"}>WHY CHOOSE US</h4>
          <h2 className={"text-3xl md:text-4xl font-semibold text-gray-800"}>
            More Reasons to{" "}
            <span className={"text-cyan"}>Choose RelateWorld</span>
          </h2>
        </div>
        <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
          {points.map((point, i) => (
            <div
              key={i}
              className={
                "bg-white p-6 rounded-xl border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300"
              }
            >
              <div className={"mb-4 flex justify-center"}>{point.icon}</div>
              <h3 className={"text-lg font-semibold text-gray-800 mb-2"}>
                {point.title}
              </h3>
              <p className={"text-gray-600 text-sm leading-relaxed"}>
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
