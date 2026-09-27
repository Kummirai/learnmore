import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import PlayerRegistrationForm from "@/components/sports/PlayerRegistrationForm";
import { SPORTS_TEAMS } from "@/constants/relate";

type Params = { params: Promise<{ id: string }> };
type Search = { searchParams: Promise<{ position?: string | string[] }> };

export function generateStaticParams() {
  return SPORTS_TEAMS.map((team) => ({ id: team.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const team = SPORTS_TEAMS.find((t) => t.id === id);
  if (!team) return { title: "Register · Relate" };
  return {
    title: `Register for ${team.name} · Relate`,
    description: `Claim a position on the ${team.name} squad — add your profile photo, position, height and playing details.`,
  };
}

export default async function RegisterPage({ params, searchParams }: Params & Search) {
  const { id } = await params;
  const sp = await searchParams;
  const team = SPORTS_TEAMS.find((t) => t.id === id);
  if (!team) notFound();

  const position = Array.isArray(sp.position) ? sp.position[0] : sp.position;

  return (
    <>
      <Navbar />
      <RequireAuth
        title={`Register for ${team.name}`}
        blurb="Sign in to claim a position on the squad — we keep your registration with your account."
        next={`/sports/${team.id}/register`}
      >
        <PlayerRegistrationForm team={team} defaultPosition={position ?? ""} />
      </RequireAuth>
    </>
  );
}
