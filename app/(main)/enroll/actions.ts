"use server"

export type EnrollState = {
    success: boolean
    message: string
    errors?: Record<string, string>
}

export async function submitEnrollment(prev: EnrollState | null, formData: FormData): Promise<EnrollState> {
    await new Promise(r => setTimeout(r, 1000))

    const parentName = formData.get("parentName") as string
    const parentEmail = formData.get("parentEmail") as string
    const parentPhone = formData.get("parentPhone") as string
    const childName = formData.get("childName") as string
    const childDob = formData.get("childDob") as string
    const grade = formData.get("grade") as string

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

    return {
        success: true,
        message: `Thank you, ${parentName}! Your enrollment for ${childName} (Grade ${grade}) has been received. We will contact you at ${parentEmail} within 2 business days.`
    }
}
