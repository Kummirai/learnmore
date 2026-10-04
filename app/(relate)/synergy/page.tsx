import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("synergy")
}

export default function SynergyPage() {
    return <ClubPage slug={"synergy"}/>
}
