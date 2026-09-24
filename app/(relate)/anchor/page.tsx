import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("anchor")
}

export default function AnchorPage() {
    return <ClubPage slug={"anchor"}/>
}