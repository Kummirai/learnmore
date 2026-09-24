import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("prime")
}

export default function PrimePage() {
    return <ClubPage slug={"prime"}/>
}