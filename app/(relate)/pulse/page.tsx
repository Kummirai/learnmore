import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("pulse")
}

export default function PulsePage() {
    return <ClubPage slug={"pulse"}/>
}