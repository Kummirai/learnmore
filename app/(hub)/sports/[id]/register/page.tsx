import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import RequireAuth from "@/components/RequireAuth";
import PlayerRegistrationForm from "@/components/sports/PlayerRegistrationForm";
import { getSports, type SportsData } from "@/lib/sports";

type Params = { params: Promise<{ id: string }> };
type Search = { searchParams: Promise<{ position?: string | string[] }> };

/** Teams are only known at request time, so never bake one in. */
export const dynamic = "force-dynamic";

async function loadCatalog(): Promise<SportsData | null> {
  try {
    return await getSports();
  } catch {
    return null; // unreachable backend — the page says so below
  }
}

function CatalogError() {
  return (
    <>
      <Navbar />
      <section className="flex-1 px-4 py-24 bg-white">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan mb-2">
            Relate · Registration
          </p>
          <h1 className="text-3xl font-black tracking-tight text-navy mb-3">
            Teams unavailable
          </h1>
          <p className="text-sm text-slate-gray">
            We couldn&rsquo;t load the squads right now, so there is nothing to
            register for. Reload the page to try again.
          </p>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const catalog = await loadCatalog();
  if (!catalog) return { title: "Register · Relate" };
  const team = catalog.getTeam(id);
  if (!team) return { title: "Register · Relate" };
  return {
    title: `Register for ${team.name} · Relate`,
    description: `Claim a position on the ${team.name} squad — add your profile photo, position, height and playing details.`,
  };
}

export default async function RegisterPage({ params, searchParams }: Params & Search) {
  const { id } = await params;
  const sp = await searchParams;
  const catalog = await loadCatalog();
  if (!catalog) return <CatalogError />;
  const team = catalog.getTeam(id);
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
