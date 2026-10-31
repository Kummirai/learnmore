"use client";

import { useCallback, useEffect, useState } from "react";
import { LuCalendarPlus, LuPlus, LuTrash2 } from "react-icons/lu";
import { AdminHeader, Badge, Button, Card, Field, Input, Select } from "@/components/admin/ui";

type Team = { id: string; name: string; sport: string };
type Fixture = { date: string; time: string; competition: string; opponent: string; venue: string; home: boolean };
const blankFixture = (): Fixture => ({ date: "", time: "15:00", competition: "", opponent: "", venue: "Relate Grounds", home: true });

export default function AdminSportsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [squads, setSquads] = useState<Record<string, { fixtures?: Fixture[] }>>({});
  const [teamId, setTeamId] = useState("");
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/sports", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Couldn't load sports fixtures.");
      const loadedTeams = Array.isArray(json?.data?.teams) ? json.data.teams : [];
      const loadedSquads = json?.data?.squads && typeof json.data.squads === "object" ? json.data.squads : {};
      setTeams(loadedTeams);
      setSquads(loadedSquads);
      const firstId = loadedTeams[0]?.id || "";
      setTeamId((current) => {
        const selected = current && loadedTeams.some((team: Team) => team.id === current) ? current : firstId;
        setFixtures(Array.isArray(loadedSquads[selected]?.fixtures) ? loadedSquads[selected].fixtures : []);
        return selected;
      });
      return loadedSquads;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load sports fixtures.");
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, [load]);

  const selectTeam = async (id: string) => {
    setTeamId(id);
    setNotice("");
    setFixtures([]);
    const squad = squads[id];
    setFixtures(Array.isArray(squad?.fixtures) ? squad.fixtures : []);
  };

  const save = async () => {
    if (!teamId) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/sports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, fixtures }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Couldn't save fixtures.");
      setNotice("Fixtures saved and published.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save fixtures.");
    } finally {
      setSaving(false);
    }
  };

  const updateFixture = (index: number, patch: Partial<Fixture>) => {
    setFixtures((rows) => rows.map((row, i) => i === index ? { ...row, ...patch } : row));
    setNotice("");
  };

  return (
    <div className="space-y-5">
      <AdminHeader icon={LuCalendarPlus} eyebrow="Sports" title="Fixtures" description="Create and manage the match calendar published to the web and mobile apps." />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

      <Card>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <Field label="Team">
            <Select value={teamId} onChange={(e) => void selectTeam(e.target.value)} disabled={loading || teams.length === 0}>
              {teams.length === 0 && <option value="">No teams available</option>}
              {teams.map((team) => <option key={team.id} value={team.id}>{team.name} · {team.sport}</option>)}
            </Select>
          </Field>
          <Button onClick={() => setFixtures((rows) => [...rows, blankFixture()])} disabled={!teamId}><LuPlus /> Add fixture</Button>
        </div>
      </Card>

      {loading ? (
        <Card><p className="text-sm text-slate-gray">Loading fixtures…</p></Card>
      ) : !teamId ? (
        <Card><div className="py-10 text-center"><LuCalendarPlus className="mx-auto mb-3 text-3xl text-slate-300" /><p className="font-bold text-navy">No teams available</p><p className="mt-1 text-sm text-slate-gray">Publish a sports catalogue before creating fixtures.</p></div></Card>
      ) : fixtures.length === 0 ? (
        <Card><div className="py-10 text-center"><LuCalendarPlus className="mx-auto mb-3 text-3xl text-slate-300" /><p className="font-bold text-navy">No fixtures scheduled</p><p className="mt-1 text-sm text-slate-gray">Add the first fixture to publish this team&rsquo;s match calendar.</p></div></Card>
      ) : fixtures.map((fixture, index) => (
        <Card key={index}>
          <div className="mb-4 flex items-center justify-between"><Badge>{fixture.date ? fixture.date : `Fixture ${index + 1}`}</Badge><button type="button" aria-label="Remove fixture" onClick={() => setFixtures((rows) => rows.filter((_, i) => i !== index))} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><LuTrash2 /></button></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Date"><Input type="date" value={fixture.date} onChange={(e) => updateFixture(index, { date: e.target.value })} /></Field>
            <Field label="Kick-off"><Input type="time" value={fixture.time} onChange={(e) => updateFixture(index, { time: e.target.value })} /></Field>
            <Field label="Opponent"><Input value={fixture.opponent} placeholder="Opposing team" onChange={(e) => updateFixture(index, { opponent: e.target.value })} /></Field>
            <Field label="Venue"><Input value={fixture.venue} placeholder="Venue" onChange={(e) => updateFixture(index, { venue: e.target.value })} /></Field>
            <Field label="Competition"><Input value={fixture.competition} placeholder="League / Cup" onChange={(e) => updateFixture(index, { competition: e.target.value })} /></Field>
            <Field label="Home or away"><Select value={fixture.home ? "home" : "away"} onChange={(e) => updateFixture(index, { home: e.target.value === "home" })}><option value="home">Home</option><option value="away">Away</option></Select></Field>
          </div>
        </Card>
      ))}

      {teamId && <div className="flex justify-end"><Button onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : "Save fixtures"}</Button></div>}
    </div>
  );
}
