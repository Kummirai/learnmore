"use client"

import {useActionState, useEffect} from "react"
import {submitEnrollment} from "./actions"
import Link from "next/link"
import {LuArrowLeft, LuCircleCheck, LuCircleAlert} from "react-icons/lu"

const grades = ["R", "1", "2", "3", "4", "5", "6", "7"]

function Field({label, name, type = "text", error, ...props}: {
    label: string
    name: string
    type?: string
    error?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label htmlFor={name} className={"block text-sm font-medium text-gray-700 mb-1"}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                className={`w-full px-4 py-2.5 rounded border ${error ? "border-red-400 ring-1 ring-red-400" : "border-gray-300"} text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition`}
                {...props}
            />
            {error && <p className={"text-red-500 text-xs mt-1"}>{error}</p>}
        </div>
    )
}

export default function EnrollPage() {
    const [state, formAction, pending] = useActionState(submitEnrollment, null)

    useEffect(() => {
        if (state?.success && state.whatsappUrl) {
            window.open(state.whatsappUrl, "_blank")
        }
    }, [state])

    if (state?.success) {
        return (
            <section className={"flex-1 flex items-center justify-center px-4 py-16"}>
                <div className={"max-w-lg w-full bg-white rounded-xl p-8 md:p-12 text-center shadow-sm"}>
                    <LuCircleCheck className={"text-6xl text-green-600 mx-auto mb-4"}/>
                    <h1 className={"text-2xl md:text-3xl font-semibold text-gray-800 mb-3"}>Enrollment Submitted!</h1>
                    <p className={"text-gray-600 leading-relaxed mb-6"}>{state.message}</p>
                    <Link href={"/"}
                          className={"inline-block bg-green-600 text-white px-8 py-3 rounded text-sm font-medium hover:bg-green-700 transition-colors"}>
                        Back to Home
                    </Link>
                </div>
            </section>
        )
    }

    return (
        <section className={"flex-1 flex items-center justify-center px-4 py-12"}>
            <div className={"max-w-2xl w-full"}>
                <Link href={"/"}
                      className={"inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mb-6 transition-colors"}>
                    <LuArrowLeft/> Back to Home
                </Link>

                <div className={"bg-white rounded-xl p-8 md:p-10 shadow-sm"}>
                    <div className={"mb-8"}>
                        <h1 className={"text-2xl md:text-3xl font-semibold text-gray-800"}>Enroll Your Child</h1>
                        <p className={"text-gray-500 text-sm mt-1"}>Fill in the details below and we&rsquo;ll get back to
                            you.</p>
                    </div>

                    <form action={formAction} className={"space-y-5"}>
                        <fieldset>
                            <legend className={"text-sm font-semibold text-green-600 mb-3"}>Parent / Guardian Details
                            </legend>
                            <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
                                <Field label={"Full Name"} name={"parentName"}
                                       error={state?.errors?.parentName}
                                       placeholder={"e.g. Thandi Mokoena"}/>
                                <Field label={"Email Address"} name={"parentEmail"} type={"email"}
                                       error={state?.errors?.parentEmail}
                                       placeholder={"e.g. thandi@email.com"}/>
                                <Field label={"Phone Number"} name={"parentPhone"} type={"tel"}
                                       error={state?.errors?.parentPhone}
                                       placeholder={"e.g. +27 82 123 4567"}
                                       className={"sm:col-span-2"}/>
                            </div>
                        </fieldset>

                        <hr className={"border-gray-200"}/>

                        <fieldset>
                            <legend className={"text-sm font-semibold text-green-600 mb-3"}>Child / Learner Details
                            </legend>
                            <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
                                <Field label={"Child's Full Name"} name={"childName"}
                                       error={state?.errors?.childName}
                                       placeholder={"e.g. Amahle Mokoena"}/>
                                <Field label={"Date of Birth"} name={"childDob"} type={"date"}
                                       error={state?.errors?.childDob}/>
                                <div>
                                    <label htmlFor={"grade"}
                                           className={"block text-sm font-medium text-gray-700 mb-1"}>Current
                                        Grade</label>
                                    <select id={"grade"} name={"grade"}
                                            className={`w-full px-4 py-2.5 rounded border ${state?.errors?.grade ? "border-red-400 ring-1 ring-red-400" : "border-gray-300"} text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white`}>
                                        <option value="">Select grade...</option>
                                        {grades.map(g => (
                                            <option key={g} value={g}>Grade {g}</option>
                                        ))}
                                    </select>
                                    {state?.errors?.grade &&
                                        <p className={"text-red-500 text-xs mt-1"}>{state.errors.grade}</p>}
                                </div>
                                <Field label={"Previous School (optional)"} name={"previousSchool"}/>
                            </div>
                        </fieldset>

                        <hr className={"border-gray-200"}/>

                        <div>
                            <label htmlFor={"notes"}
                                   className={"block text-sm font-medium text-gray-700 mb-1"}>Additional Notes
                                (optional)</label>
                            <textarea id={"notes"} name={"notes"} rows={3}
                                      className={"w-full px-4 py-2.5 rounded border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition resize-none"}
                                      placeholder={"Any special requirements or information..."}/>
                        </div>

                        {state?.message && !state.success && (
                            <div
                                className={"flex items-start gap-2 p-3 rounded bg-red-50 text-red-600 text-sm"}>
                                <LuCircleAlert className={"mt-0.5 shrink-0"}/>
                                <span>{state.message}</span>
                            </div>
                        )}

                        <button type={"submit"} disabled={pending}
                                className={"w-full bg-green-600 text-white py-3 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"}>
                            {pending ? "Submitting..." : "Submit Enrollment"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
