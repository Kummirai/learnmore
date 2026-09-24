import MagazinePage from "@/components/MagazinePage"
import { magazineMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return magazineMetadataFromSlug("footsteps")
}

export default function FootstepsPage() {
    return <MagazinePage slug={"footsteps"}/>
}