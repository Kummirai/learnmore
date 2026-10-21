"use server"

import { buildContactMailto, CONTACT_EMAIL } from "@/lib/contact-mailto"

export type ContactState = {
    success: boolean
    message: string
    mailtoUrl?: string
}

export async function submitContact(prev: ContactState | null, formData: FormData): Promise<ContactState> {
    await new Promise(r => setTimeout(r, 800))
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string
    if (!name || !email || !message) return {success: false, message: "Please fill in all required fields."}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {success: false, message: "Please enter a valid email."}

    return {
        success: true,
        message: `Thank you, ${name}! Opening your email app to send your message to ${CONTACT_EMAIL}...`,
        mailtoUrl: buildContactMailto(name, email, subject, message),
    }
}
