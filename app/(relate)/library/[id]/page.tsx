import {notFound} from "next/navigation"
import PublicationReader from "@/components/publications/PublicationReader"
import {getPublication} from "@/lib/publications"

export const dynamic = "force-dynamic"

export default async function PublicationPage({
    params,
}: {
    params: Promise<{id: string}>
}) {
    const {id} = await params
    const doc = await getPublication(id)

    if (!doc) {
        notFound()
    }

    return <PublicationReader doc={doc}/>
}