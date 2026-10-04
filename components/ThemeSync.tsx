"use client"

import {useEffect} from "react"
import {usePathname} from "next/navigation"
import {useClubs} from "@/lib/useClubs"
import {colors} from "@/constants/colors"

const DEFAULT_ACCENT = "#13c5dd"
const DEFAULT_ACCENT_DARK = "#0fa3c4"
const DEFAULT_ON_ACCENT = "#1d2a4d"
const DEFAULT_CHROME = "#151f3a"
const DEFAULT_CHROME_DARK = "#0f1830"

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

function mix(hexA: string, hexB: string, t: number): string {
    const pa = parseInt(hexA.replace("#", ""), 16)
    const pb = parseInt(hexB.replace("#", ""), 16)
    if (Number.isNaN(pa) || Number.isNaN(pb)) return hexA
    const chan = (shift: number) =>
        Math.round(((pa >> shift) & 255) * t + ((pb >> shift) & 255) * (1 - t))
    return `#${((1 << 24) + (chan(16) << 16) + (chan(8) << 8) + chan(0)).toString(16).slice(1)}`
}

export default function ThemeSync() {
    const pathname = usePathname()
    const {find} = useClubs()

    useEffect(() => {
        const root = document.documentElement
        const club = find(pathname?.split("/").filter(Boolean)[0])
        root.style.setProperty("--club-accent", club?.color ?? DEFAULT_ACCENT)
        root.style.setProperty("--club-accent-dark", club?.colorDark ?? DEFAULT_ACCENT_DARK)
        root.style.setProperty("--club-on-accent", club ? onAccentFor(club.color) : DEFAULT_ON_ACCENT)
        root.style.setProperty(
            "--club-chrome",
            club ? mix(club.color, colors.navyDark, 0.45) : DEFAULT_CHROME,
        )
        root.style.setProperty(
            "--club-chrome-dark",
            club ? mix(club.colorDark, colors.navyDark, 0.4) : DEFAULT_CHROME_DARK,
        )
    }, [pathname, find])

    return null
}