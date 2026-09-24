import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("sprout-kids")
}

export default function SproutKidsPage() {
    return <ClubPage slug={"sprout-kids"}/>
}