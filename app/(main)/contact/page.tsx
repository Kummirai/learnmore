"use client";

import { useActionState, useEffect } from "react";
import {
  LuMapPin,
  LuPhone,
  LuMail,
  LuClock,
  LuCircleCheck,
  LuCircleAlert,
} from "react-icons/lu";
import { submitContact } from "./actions";

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitContact, null);

  useEffect(() => {
    if (state?.success && state.whatsappUrl) {
      window.open(state.whatsappUrl, "_blank");
    }
  }, [state]);

  return (
    <section className={"flex-1 px-4 py-12"}>
      <div className={"max-w-4xl mx-auto"}>
        <div className={"text-center mb-10"}>
          <h1
            className={"text-3xl md:text-4xl font-semibold text-gray-800 mb-3"}
          >
            Contact Us
          </h1>
          <p className={"text-gray-500 max-w-xl mx-auto"}>
            We&rsquo;d love to hear from you. Get in touch with us using the
            form below or visit our school.
          </p>
        </div>

        <div className={"grid grid-cols-1 md:grid-cols-2 gap-8"}>
          <div className={"bg-white rounded-xl p-8 shadow-sm"}>
            {state?.success ? (
              <div className={"text-center py-12"}>
                <LuCircleCheck className={"text-5xl text-cyan mx-auto mb-4"} />
                <p className={"text-gray-700"}>{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className={"space-y-4"}>
                <div>
                  <label
                    htmlFor={"name"}
                    className={"block text-sm font-medium text-gray-700 mb-1"}
                  >
                    Full Name *
                  </label>
                  <input
                    id={"name"}
                    name={"name"}
                    required
                    autoComplete={"name"}
                    className={
                      "w-full px-4 py-2.5 rounded border border-gray-300 text-base md:text-sm outline-none focus:ring-2 focus:ring-cyan"
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={"email"}
                    className={"block text-sm font-medium text-gray-700 mb-1"}
                  >
                    Email Address *
                  </label>
                  <input
                    id={"email"}
                    name={"email"}
                    type={"email"}
                    required
                    autoComplete={"email"}
                    spellCheck={false}
                    autoCapitalize={"none"}
                    autoCorrect={"off"}
                    className={
                      "w-full px-4 py-2.5 rounded border border-gray-300 text-base md:text-sm outline-none focus:ring-2 focus:ring-cyan"
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor={"subject"}
                    className={"block text-sm font-medium text-gray-700 mb-1"}
                  >
                    Subject
                  </label>
                  <select
                    id={"subject"}
                    name={"subject"}
                    className={
                      "w-full px-4 py-2.5 rounded border border-gray-300 text-base md:text-sm outline-none focus:ring-2 focus:ring-cyan bg-white"
                    }
                  >
                    <option>General Enquiry</option>
                    <option>Enrollment Question</option>
                    <option>Fee Enquiry</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor={"message"}
                    className={"block text-sm font-medium text-gray-700 mb-1"}
                  >
                    Message *
                  </label>
                  <textarea
                    id={"message"}
                    name={"message"}
                    rows={4}
                    required
                    className={
                      "w-full px-4 py-2.5 rounded border border-gray-300 text-base md:text-sm outline-none focus:ring-2 focus:ring-cyan"
                    }
                  />
                </div>
                {state?.message && (
                  <div
                    role="alert"
                    className={
                      "flex items-start gap-2 p-3 rounded bg-red-50 text-red-600 text-sm"
                    }
                  >
                    <LuCircleAlert className={"mt-0.5 shrink-0"} />
                    <span>{state.message}</span>
                  </div>
                )}
                <button
                  type={"submit"}
                  disabled={pending}
                  className={
                    "w-full bg-navy text-white py-3 rounded text-sm font-medium hover:bg-navy-dark disabled:opacity-60 transition-colors"
                  }
                >
                  {pending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className={"space-y-6"}>
            <div className={"bg-white rounded-xl p-6 shadow-sm"}>
              <h3 className={"font-semibold text-gray-800 mb-4"}>Visit Us</h3>
              <div className={"space-y-4 text-sm"}>
                <div className={"flex items-start gap-3"}>
                  <LuMapPin className={"mt-0.5 shrink-0 text-cyan"} />
                  <span className={"text-gray-600"}>
                    123 Education Street, Learning City, 2000
                  </span>
                </div>
                <div className={"flex items-center gap-3"}>
                  <LuPhone className={"shrink-0 text-cyan"} />
                  <span className={"text-gray-600"}>+27 78 267 7436</span>
                </div>
                <div className={"flex items-center gap-3"}>
                  <LuMail className={"shrink-0 text-cyan"} />
                  <span className={"text-gray-600"}>info@RelateWorld.edu</span>
                </div>
                <div className={"flex items-start gap-3"}>
                  <LuClock className={"mt-0.5 shrink-0 text-cyan"} />
                  <span className={"text-gray-600"}>
                    Mon - Fri: 7:30AM - 4:00PM
                  </span>
                </div>
              </div>
            </div>

            <div
              className={
                "bg-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400 text-sm"
              }
            >
              <div className={"text-center"}>
                <LuMapPin className={"text-3xl mx-auto mb-2"} />
                <p>Map Placeholder</p>
                <p className={"text-xs"}>123 Education Street, Learning City</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
