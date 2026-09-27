import type { Metadata } from "next";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import JoinForm from "@/components/join/JoinForm";
import { MEMBER_COOKIE, parseMembership } from "@/lib/membership";

export const metadata: Metadata = {
  title: "Join a Club · Relate",
  description:
    "Register for a Relate club — tell us about yourself and your interests to create your membership, then join squads and activities with everything already filled in.",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const member = parseMembership(
    (await cookies()).get(MEMBER_COOKIE)?.value,
  );
  return (
    <>
      <Navbar />
      <JoinForm
        defaultClub={String(sp?.club ?? "")}
        defaultTeam={String(sp?.team ?? "")}
        member={member}
      />
    </>
  );
}
