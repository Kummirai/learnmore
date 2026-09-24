import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("nexus")
}

export default function NexusPage() {
    return <ClubPage slug={"nexus"}/>
}