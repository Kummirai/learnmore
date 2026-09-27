import type { Metadata } from "next";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import MembershipView from "@/components/membership/MembershipView";
import { MEMBER_COOKIE, parseMembership } from "@/lib/membership";

export const metadata: Metadata = {
  title: "My Membership · Relate",
  description:
    "See your Relate membership — your club, squad, interests and reference — exactly as your leader records it.",
};

export default async function MembershipPage() {
  const member = parseMembership((await cookies()).get(MEMBER_COOKIE)?.value);
  return (
    <>
      <Navbar />
      <MembershipView member={member} />
    </>
  );
}
