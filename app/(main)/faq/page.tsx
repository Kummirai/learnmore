"use client";

import { useState } from "react";
import Link from "next/link";
import { LuChevronDown } from "react-icons/lu";

const faqs = [
  {
    q: "What are the school hours?",
    a: "School starts at 7:45 AM and ends at 1:00 PM for Grade R, and 2:00 PM for Grade 1-7. The school gates open at 7:15 AM. Aftercare is available until 5:30 PM.",
  },
  {
    q: "How do I enroll my child?",
    a: "You can enroll your child by visiting our Enroll page and filling out the online form. Alternatively, you can visit the school office during school hours to collect a paper application form.",
  },
  {
    q: "What documents are needed for enrollment?",
    a: "You will need your child's birth certificate, latest report card, immunisation card, passport-sized photos (2), parent/guardian ID, and proof of residence.",
  },
  {
    q: "Is there a school uniform?",
    a: "Yes. Our uniform consists of a green and yellow polo shirt, navy trousers/skorts, and black school shoes. The full uniform list is available at the school office and our uniform supplier.",
  },
  {
    q: "What aftercare options are available?",
    a: "We offer aftercare from 1:00 PM to 5:30 PM (Monday to Friday) including homework supervision, snacks, and playtime. Holiday care is also available during school breaks.",
  },
  {
    q: "What extracurricular activities do you offer?",
    a: "We offer soccer, netball, athletics, swimming, choir, recorder, arts & crafts, chess, and public speaking. Most activities take place after school.",
  },
  {
    q: "What is the learner-to-teacher ratio?",
    a: "Our average class size is 25 learners per teacher in the Foundation Phase (Grade R-3) and 30 learners per teacher in the Intermediate Phase (Grade 4-7).",
  },
  {
    q: "Do you offer transport services?",
    a: "Yes, we have a school bus service covering the main residential areas within a 15km radius. Please contact the office for route details and fees.",
  },
  {
    q: "What is the school's pass rate?",
    a: "RelateWorld has achieved a 100% pass rate for the past 5 consecutive years. Our learners consistently score above the national average in all subjects.",
  },
  {
    q: "How do you support learners with special needs?",
    a: "We have a dedicated Learning Support teacher who works with learners requiring additional assistance. We also offer remedial classes and work closely with educational psychologists when needed.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={"flex-1 px-4 py-12"}>
      <div className={"max-w-3xl mx-auto"}>
        <div className={"text-center mb-10"}>
          <h1
            className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}
          >
            Frequently Asked Questions
          </h1>
          <p className={"text-gray-500 max-w-xl mx-auto"}>
            Find answers to common questions about our school.
          </p>
        </div>

        <div className={"space-y-3"}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={"bg-white rounded-xl shadow-sm overflow-hidden"}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={
                  "w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                }
              >
                <span
                  className={
                    "font-medium text-gray-800 text-sm md:text-base pr-4"
                  }
                >
                  {faq.q}
                </span>
                <LuChevronDown
                  className={`text-lg text-gray-400 shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-60" : "max-h-0"}`}
              >
                <div
                  className={
                    "px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4"
                  }
                >
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={
            "bg-alice-blue rounded-xl p-8 text-center mt-10 border border-ice-blue"
          }
        >
          <h2 className={"text-lg font-semibold text-navy-dark mb-2"}>
            Still Have Questions?
          </h2>
          <p className={"text-sm text-navy mb-4"}>
            We&rsquo;re happy to help. Reach out to us directly.
          </p>
          <Link
            href={"/contact"}
            className={
              "inline-block bg-navy text-white px-8 py-3 text-sm font-medium rounded hover:bg-navy-dark transition-colors"
            }
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
