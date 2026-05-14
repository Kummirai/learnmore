"use client"

import {useState} from "react"
import {LuChevronLeft, LuChevronRight, LuImage} from "react-icons/lu"

const photos = [
    {label: "Sports Day 2025", color: "bg-green-600"},
    {label: "Science Fair Projects", color: "bg-blue-600"},
    {label: "Grade R Graduation", color: "bg-purple-600"},
    {label: "Heritage Day Celebrations", color: "bg-orange-600"},
    {label: "School Choir Performance", color: "bg-pink-600"},
    {label: "Chess Tournament", color: "bg-cyan-600"},
]

export default function PhotoHighlights() {
    const [start, setStart] = useState(0)
    const visible = 4

    const next = () => setStart(s => Math.min(s + 1, photos.length - visible))
    const prev = () => setStart(s => Math.max(s - 1, 0))

    return (
        <section className={"py-16 md:py-20 bg-white px-4"}>
            <div className={"max-w-6xl mx-auto"}>
                <div className={"text-center mb-8"}>
                    <h4 className={"text-green-600 font-medium mb-1"}>SCHOOL LIFE</h4>
                    <h2 className={"text-2xl md:text-3xl font-semibold text-gray-800"}>Moments at LearnMore</h2>
                </div>
                <div className={"relative"}>
                    <div className={"grid grid-cols-2 md:grid-cols-4 gap-4"}>
                        {photos.slice(start, start + visible).map((p, i) => (
                            <div key={i}
                                 className={`${p.color} rounded-xl aspect-[4/3] flex flex-col items-center justify-center text-white hover:scale-[1.02] transition-transform cursor-pointer`}>
                                <LuImage className={"text-4xl mb-2 opacity-60"}/>
                                <span className={"text-sm font-medium text-center px-2"}>{p.label}</span>
                            </div>
                        ))}
                    </div>
                    {photos.length > visible && (
                        <>
                            <button onClick={prev} disabled={start === 0}
                                    className={"absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 size-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition"}>
                                <LuChevronLeft className={"text-xl"}/>
                            </button>
                            <button onClick={next} disabled={start >= photos.length - visible}
                                    className={"absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 size-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed transition"}>
                                <LuChevronRight className={"text-xl"}/>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}
