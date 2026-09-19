import Link from "next/link";
import { LuArrowLeft, LuTarget, LuEye, LuHeart } from "react-icons/lu";

export default function AboutPage() {
  return (
    <section className={"flex-1 px-4 py-12"}>
      <div className={"max-w-4xl mx-auto"}>
        <Link
          href={"/"}
          className={
            "inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mb-6 transition-colors"
          }
        >
          <LuArrowLeft /> Back to Home
        </Link>

        <div className={"text-center mb-12"}>
          <h1
            className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}
          >
            About RelateWorld
          </h1>
          <p className={"text-gray-500 max-w-xl mx-auto"}>
            A nurturing primary school committed to excellence in education,
            character development, and community since 2000.
          </p>
        </div>

        <div className={"bg-white rounded-xl p-8 md:p-10 shadow-sm mb-8"}>
          <h2 className={"text-xl font-semibold text-gray-800 mb-4"}>
            Our Story
          </h2>
          <div className={"space-y-4 text-gray-600 text-sm leading-relaxed"}>
            <p>
              Founded in 2000, RelateWorld Primary School began with a simple
              vision: to provide quality education that nurtures every
              child&rsquo;s potential. What started with just 45 learners and 6
              teachers has grown into a thriving school of over 850 learners.
            </p>
            <p>
              Located in the heart of Learning City, our school serves families
              from Grade R through Grade 7. We pride ourselves on our strong
              academic record, dedicated staff, and vibrant school culture that
              celebrates diversity and achievement.
            </p>
            <p>
              Over the past 25 years, we have consistently achieved a 100% pass
              rate while developing well-rounded individuals who are ready for
              high school and beyond.
            </p>
          </div>
        </div>

        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"}>
          <div className={"bg-white rounded-xl p-6 shadow-sm text-center"}>
            <LuTarget className={"text-4xl text-cyan mx-auto mb-3"} />
            <h3 className={"font-semibold text-gray-800 mb-2"}>Our Mission</h3>
            <p className={"text-gray-600 text-sm leading-relaxed"}>
              To provide a safe, inclusive, and stimulating environment where
              every learner achieves academic excellence and personal growth.
            </p>
          </div>
          <div className={"bg-white rounded-xl p-6 shadow-sm text-center"}>
            <LuEye className={"text-4xl text-cyan mx-auto mb-3"} />
            <h3 className={"font-semibold text-gray-800 mb-2"}>Our Vision</h3>
            <p className={"text-gray-600 text-sm leading-relaxed"}>
              To be a leading primary school that nurtures confident,
              compassionate, and curious lifelong learners.
            </p>
          </div>
          <div className={"bg-white rounded-xl p-6 shadow-sm text-center"}>
            <LuHeart className={"text-4xl text-cyan mx-auto mb-3"} />
            <h3 className={"font-semibold text-gray-800 mb-2"}>Our Values</h3>
            <p className={"text-gray-600 text-sm leading-relaxed"}>
              Respect, Responsibility, Resilience, Integrity, and Compassion
              guide everything we do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
