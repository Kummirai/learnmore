"use server"

export type NewsletterState = {
    success: boolean
    message: string
}

export async function subscribeNewsletter(prev: NewsletterState | null, formData: FormData): Promise<NewsletterState> {
    await new Promise(r => setTimeout(r, 600))

    const email = formData.get("email") as string

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {success: false, message: "Please enter a valid email address."}
    }

    return {success: true, message: "Thank you! You've been subscribed to our newsletter."}
}
