import MagazinePage from "@/components/MagazinePage"
import { magazineMetadataFromSlug } from "@/lib/seo"

export function generateMetadata() {
    return magazineMetadataFromSlug("rooted")
}

export default function RootedPage() {
    return <MagazinePage slug={"rooted"}/>
}