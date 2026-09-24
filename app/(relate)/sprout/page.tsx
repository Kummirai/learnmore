import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("sprout")
}

export default function SproutPage() {
    return <ClubPage slug={"sprout"}/>
}