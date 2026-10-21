"use server"

const INBOX = "info@relateworld.org"

export type ContactState = {
    success: boolean
    message: string
    mailtoUrl?: string
}

export async function submitContact(prev: ContactState | null, formData: FormData): Promise<ContactState> {
    await new Promise(r => setTimeout(r, 800))
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = (formData.get("subject") as string) || "General Enquiry"
    const message = formData.get("message") as string
    if (!name || !email || !message) return {success: false, message: "Please fill in all required fields."}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {success: false, message: "Please enter a valid email."}

    const body = [
        "New Contact Message",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
    ].join("\n")

    return {
        success: true,
        message: `Thank you, ${name}! Opening your email app to send your message to ${INBOX}...`,
        mailtoUrl: `mailto:${INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    }
}
