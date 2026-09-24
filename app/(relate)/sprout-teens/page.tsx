import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("sprout-teens")
}

export default function SproutTeensPage() {
    return <ClubPage slug={"sprout-teens"}/>
}