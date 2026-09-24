import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("base")
}

export default function BasePage() {
    return <ClubPage slug={"base"}/>
}