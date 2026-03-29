'use client';

import { useMemo, useState } from 'react';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function TeamGeneratorPage() {
  const { state, generateTeams } = useAppState();
  const [eventId, setEventId] = useState(state.events[0]?.id ?? '');
  const [teamSize, setTeamSize] = useState(2);

  const generated = useMemo(() => (eventId ? generateTeams(eventId, teamSize) : { teams: [] }), [eventId, teamSize, generateTeams]);

  return (
    <RoleGate allow="manager">
      <div className="space-y-4">
        <div className="card">
          <h1 className="text-2xl font-semibold">Team Generator</h1>
          <p className="text-sm text-slate-600">Balanced using current-year handicap + scoring history.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              Event
              <select className="mt-1 w-full rounded border px-3 py-2" value={eventId} onChange={(e) => setEventId(e.target.value)}>
                {state.events.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Team Size
              <select className="mt-1 w-full rounded border px-3 py-2" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))}>
                <option value={2}>2-man</option>
                <option value={3}>3-man</option>
                <option value={4}>4-man</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {generated.teams.map((team) => (
            <div key={team.name} className="card">
              <h2 className="font-semibold">{team.name}</h2>
              <p className="text-sm">Avg Handicap: {team.averageHandicap}</p>
              <p className="text-sm">Avg Gross: {team.averageGross}</p>
              <ul className="mt-2 text-sm">
                {team.playerIds.map((pid) => {
                  const u = state.users.find((usr) => usr.playerId === pid);
                  return <li key={pid}>{u?.name ?? pid}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </RoleGate>
  );
}
