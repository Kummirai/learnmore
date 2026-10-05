import { redirect } from "next/navigation";

type Params = { badge: string };

export async function generateMetadata() {
  return {};
}

export default async function SkillDetailRedirect({ params }: { params: Promise<Params> }) {
  redirect("/sprout/skills");
}
