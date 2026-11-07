import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import JoinTeamGate from "@/components/sports/JoinTeamGate";

export const metadata: Metadata = {
  title: "Join a team · Relate",
  description:
    "Club members can register for a Relate sports team — pick a squad and claim your position.",
};

export default function JoinTeamPage() {
  return (
    <>
      <Navbar />
      <RequireAuth
        title="Join a team"
        blurb="Sign in first — your team seat and Membership ID stay with your account, so they show up on any device."
        next="/join-team"
      >
        <JoinTeamGate />
      </RequireAuth>
    </>
  );
}
