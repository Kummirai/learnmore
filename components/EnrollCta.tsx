import Link from "next/link";

export default function EnrollCta() {
  return (
    <section
      className={"bg-gradient-to-br from-navy via-navy-soft to-navy-dark px-4"}
    >
      <div className={"max-w-4xl mx-auto py-20 text-center"}>
        <h2 className={"text-3xl md:text-4xl font-bold text-white mb-4"}>
          Find Your Crew. Grow in Every Area of Life.
        </h2>
        <p className={"text-cyan-light text-lg mb-8 max-w-2xl mx-auto"}>
          Skills, social and spiritual growth — all in one community. Clubs for
          every age and season of life, and it&apos;s 100% free to join.
        </p>
        <div className={"flex items-center justify-center gap-4 flex-wrap"}>
          <Link
            href={"/enroll"}
            className={
              "bg-cyan text-navy py-3 px-10 text-lg font-semibold hover:bg-cyan-dark transition-colors"
            }
          >
            Join a Club
          </Link>
          <a
            href={"https://wa.me/27782677436"}
            target={"_blank"}
            rel={"noopener noreferrer"}
            className={
              "bg-white/20 text-white py-3 px-10 text-lg font-medium hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/30"
            }
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
