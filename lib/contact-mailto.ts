export const CONTACT_EMAIL = "info@relateworld.org"

export function buildContactMailto(
    name: string,
    email: string,
    subject: string,
    message: string,
): string {
    const subj = subject || "General Enquiry"
    const body = [
        "New Contact Message",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subj}`,
        "",
        "Message:",
        message,
    ].join("\n")
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`
}
