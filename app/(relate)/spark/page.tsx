import ClubPage from "@/components/ClubPage"
import { clubMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return clubMetadataFromSlug("spark")
}

export default function SparkPage() {
    return <ClubPage slug={"spark"}/>
}
