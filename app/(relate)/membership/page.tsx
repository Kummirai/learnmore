import type { Metadata } from "next";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import MembershipView from "@/components/membership/MembershipView";
import { MEMBER_COOKIE, parseMembership } from "@/lib/membership";

export const metadata: Metadata = {
  title: "My Membership · Relate",
  description:
    "Your Relate membership in full — club, squad, interests, membership ID and status, plus what happens next and how to update your record.",
};

export default async function MembershipPage() {
  const member = parseMembership((await cookies()).get(MEMBER_COOKIE)?.value);
  return (
    <>
      <Navbar overlay />
      <MembershipView member={member} />
    </>
  );
}
