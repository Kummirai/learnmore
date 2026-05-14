"use server"

export type ContactState = {
    success: boolean
    message: string
}

export async function submitContact(prev: ContactState | null, formData: FormData): Promise<ContactState> {
    await new Promise(r => setTimeout(r, 800))
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string
    if (!name || !email || !message) return {success: false, message: "Please fill in all required fields."}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {success: false, message: "Please enter a valid email."}
    return {success: true, message: `Thank you, ${name}! We'll respond to your message within 24 hours.`}
}
