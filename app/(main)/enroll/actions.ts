"use server"

export type EnrollState = {
    success: boolean
    message: string
    errors?: Record<string, string>
    whatsappUrl?: string
}

export async function submitEnrollment(prev: EnrollState | null, formData: FormData): Promise<EnrollState> {
    await new Promise(r => setTimeout(r, 1000))

    const parentName = formData.get("parentName") as string
    const parentEmail = formData.get("parentEmail") as string
    const parentPhone = formData.get("parentPhone") as string
    const childName = formData.get("childName") as string
    const childDob = formData.get("childDob") as string
    const grade = formData.get("grade") as string
    const previousSchool = formData.get("previousSchool") as string
    const notes = formData.get("notes") as string

    const errors: Record<string, string> = {}

    if (!parentName || parentName.trim().length < 2) errors.parentName = "Please enter the parent/guardian name."
    if (!parentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) errors.parentEmail = "Please enter a valid email address."
    if (!parentPhone || parentPhone.trim().length < 7) errors.parentPhone = "Please enter a valid phone number."
    if (!childName || childName.trim().length < 2) errors.childName = "Please enter the child's full name."
    if (!childDob) errors.childDob = "Please select the child's date of birth."
    if (!grade) errors.grade = "Please select the current grade."

    if (Object.keys(errors).length > 0) {
        return {success: false, message: "Please fix the errors below.", errors}
    }

    const text = `New Enrollment Request%0A%0AParent: ${encodeURIComponent(parentName)}%0AEmail: ${encodeURIComponent(parentEmail)}%0APhone: ${encodeURIComponent(parentPhone)}%0AChild: ${encodeURIComponent(childName)}%0ADOB: ${encodeURIComponent(childDob)}%0AGrade: ${encodeURIComponent(grade)}${previousSchool ? `%0APrevious School: ${encodeURIComponent(previousSchool)}` : ""}${notes ? `%0ANotes: ${encodeURIComponent(notes)}` : ""}`

    return {
        success: true,
        message: `Thank you, ${parentName}! Redirecting to WhatsApp to send your enrollment details...`,
        whatsappUrl: `https://wa.me/27782677436?text=${text}`,
    }
}
