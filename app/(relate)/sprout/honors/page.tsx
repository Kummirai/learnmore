import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {};
}

export default async function SproutSkillsRedirect() {
  redirect("/sprout/skills");
}
