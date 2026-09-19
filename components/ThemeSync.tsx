"use client"

import {useEffect} from "react"
import {usePathname} from "next/navigation"
import {CLUBS, SUB_CLUBS} from "@/constants/relate"

const DEFAULT_ACCENT = "#13c5dd"
const DEFAULT_ACCENT_DARK = "#0fa3c4"
const DEFAULT_ON_ACCENT = "#1d2a4d"

function resolveClub(path: string | null) {
    const slug = path?.split("/").filter(Boolean)[0]
    return CLUBS.find((c) => c.slug === slug) ?? SUB_CLUBS.find((c) => c.slug === slug)
}

function luminance(hex: string): number {
    const n = hex.replace("#", "")
    if (n.length !== 6) return 0
    const chan = (i: number) => parseInt(n.slice(i, i + 2), 16) / 255
    const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
    return 0.2126 * lin(chan(0)) + 0.7152 * lin(chan(2)) + 0.0722 * lin(chan(4))
}

function onAccentFor(hex: string): string {
    return luminance(hex) > 0.4 ? "#1d2a4d" : "#ffffff"
}

export default function ThemeSync() {
    const pathname = usePathname()

    useEffect(() => {
        const root = document.documentElement
        const club = resolveClub(pathname)
        root.style.setProperty("--club-accent", club?.color ?? DEFAULT_ACCENT)
        root.style.setProperty("--club-accent-dark", club?.colorDark ?? DEFAULT_ACCENT_DARK)
        root.style.setProperty("--club-on-accent", club ? onAccentFor(club.color) : DEFAULT_ON_ACCENT)
    }, [pathname])

    return null
}