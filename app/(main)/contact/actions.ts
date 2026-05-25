"use server"

export type ContactState = {
    success: boolean
    message: string
    whatsappUrl?: string
}

export async function submitContact(prev: ContactState | null, formData: FormData): Promise<ContactState> {
    await new Promise(r => setTimeout(r, 800))
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string
    if (!name || !email || !message) return {success: false, message: "Please fill in all required fields."}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {success: false, message: "Please enter a valid email."}

    const text = `New Contact Message%0A%0AName: ${encodeURIComponent(name)}%0AEmail: ${encodeURIComponent(email)}%0ASubject: ${encodeURIComponent(subject || "General Enquiry")}%0AMessage: ${encodeURIComponent(message)}`

    return {
        success: true,
        message: `Thank you, ${name}! Redirecting to WhatsApp to send your message...`,
        whatsappUrl: `https://wa.me/27782677436?text=${text}`,
    }
}
