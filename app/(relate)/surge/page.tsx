import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("surge")
}

export default function SurgePage() {
    return <ClubPage slug={"surge"}/>
}