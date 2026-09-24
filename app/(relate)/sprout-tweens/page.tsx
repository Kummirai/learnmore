import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("sprout-tweens")
}

export default function SproutTweensPage() {
    return <ClubPage slug={"sprout-tweens"}/>
}