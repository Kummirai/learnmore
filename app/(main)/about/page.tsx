import Link from "next/link";
import Team from "@/components/Team";
import {
  LuArrowLeft,
  LuTarget,
  LuHeart,
  LuHandHeart,
  LuUsers,
  LuLeaf,
  LuShieldCheck,
  LuFileText,
  LuHandshake,
} from "react-icons/lu";

const principles = [
  {
    icon: LuHeart,
    title: "Compassionate Empowerment",
    body: "We lead with empathy but focus on activating an individual's own agency — asking \u201cHow can we help you achieve your goal?\u201d rather than deciding unilaterally.",
  },
  {
    icon: LuHeart,
    title: "Dignity & Respect",
    body: "All service is rendered with utmost respect for privacy, cultural background, and personal autonomy. We practise active listening, observe strict confidentiality, and uphold every person's right to self-determination.",
  },
  {
    icon: LuShieldCheck,
    title: "Integrity & Stewardship",
    body: "We are transparent and accountable for all resources — financial, material, and human. Donations and time are used efficiently and exclusively for their intended purpose.",
  },
  {
    icon: LuLeaf,
    title: "Sustainability & Self-Reliance",
    body: "We favour solutions that teach skills, create opportunities, and build networks. Help today must not create a need for help tomorrow — our goal is lasting independence.",
  },
  {
    icon: LuUsers,
    title: "Community & Partnership",
    body: "We acknowledge we cannot do everything alone. We build strong networks with partners, businesses, and government so the people we serve are wrapped in a web of support.",
  },
];

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
          <LuArrowLeft/> Back to Home
        </Link>

        <div className={"text-center mb-12"}>
          <h1
            className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}
          >
            About Relate
          </h1>
          <p className={"text-gray-500 max-w-xl mx-auto"}>
            A growing community of engaged partners — not a distant charity —
            helping every person become self-reliant and sustainable.
          </p>
        </div>

        <div className={"bg-white rounded-xl p-8 md:p-10 shadow-sm mb-8"}>
          <h2 className={"text-xl font-semibold text-gray-800 mb-4"}>
            Welcome &amp; Introduction
          </h2>
          <div className={"space-y-4 text-gray-600 text-sm leading-relaxed"}>
            <p>
              Welcome to Relate. You are now part of a mission dedicated to
              transforming lives through sustainable empowerment. Relate
              exists at the intersection of compassion and practical action.
              We believe every individual and family possesses inherent
              strength and potential, and that lasting change happens through
              connection — relating to people&rsquo;s stories, struggles, and
              aspirations.
            </p>
            <p>
              We are not a distant charity. We are engaged partners who walk
              alongside you on the road to self-reliance and sustainability.
              Our role is not to create dependence but to help you be
              self-reliant and sustainable.
            </p>
          </div>
        </div>

        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"}>
          <div className={"bg-white rounded-xl p-6 shadow-sm text-center"}>
            <LuTarget className={"text-4xl text-cyan mx-auto mb-3"}/>
            <h3 className={"font-semibold text-gray-800 mb-2"}>
              Our Mission
            </h3>
            <p className={"text-gray-600 text-sm leading-relaxed"}>
              To help you be self-reliant and sustainable. Every program,
              interaction, and resource is evaluated against this single
              outcome.
            </p>
          </div>

          <div className={"bg-white rounded-xl p-6 shadow-sm text-center"}>
            <LuHandHeart className={"text-4xl text-cyan mx-auto mb-3"}/>
            <h3 className={"font-semibold text-gray-800 mb-2"}>
              How We Engage
            </h3>
            <p className={"text-gray-600 text-sm leading-relaxed"}>
              We ask how we can help you reach your goal — then we work hand
              in hand to strengthen your own self-reliance and
              sustainability.
            </p>
          </div>

          <div className={"bg-white rounded-xl p-6 shadow-sm text-center"}>
            <LuHandshake className={"text-4xl text-cyan mx-auto mb-3"}/>
            <h3 className={"font-semibold text-gray-800 mb-2"}>
              Our Promise
            </h3>
            <p className={"text-gray-600 text-sm leading-relaxed"}>
              Help today that doesn&rsquo;t become a need for help tomorrow —
              building skills, opportunities, and networks for the long term.
            </p>
          </div>
        </div>

        <div className={"mt-10"}>
          <div className={"flex items-center gap-2 mb-6"}>
            <LuFileText className={"text-xl text-cyan"}/>
            <h2 className={"text-xl font-semibold text-gray-800"}>
              Parent &amp; Community Manual
            </h2>
          </div>
          <p className={"text-gray-600 text-sm leading-relaxed mb-4"}>
            A full RelateWorld community manual — covering our identity,
            guiding principles, governance, and role descriptions — lives in
            the Relate mobile app under&nbsp; Manual.
          </p>
          <Link
            href={"/manual"}
            className={
              "inline-flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-navy/90 transition-colors"
            }
          >
            Read the Relate Manual
          </Link>
        </div>
      </div>

      <Team />
    </section>
  );
}
