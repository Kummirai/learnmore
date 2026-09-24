import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import JoinForm from "@/components/join/JoinForm";

export const metadata: Metadata = {
  title: "Join a Sports Team · Relate",
  description:
    "Register to join a Relate sports team — pick your club and squad, then complete a short registration and chaplain interview before your place is confirmed.",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  return (
    <>
      <Navbar />
      <JoinForm defaultClub={String(sp?.club ?? "")} defaultTeam={String(sp?.team ?? "")} />
    </>
  );
}