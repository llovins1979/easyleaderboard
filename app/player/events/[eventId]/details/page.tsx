'use client';

import { useParams } from 'next/navigation';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function PlayerEventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { state, currentUser } = useAppState();

  const event = state.events.find((e) => e.id === eventId);
  const tee = state.tees.find((t) => t.id === event?.teeId);
  const teamMembership = state.teamMemberships.find((tm) => tm.playerId === currentUser?.playerId);
  const team = state.teams.find((t) => t.id === teamMembership?.teamId && t.eventId === eventId);

  if (!event) return <RoleGate allow="player"><p>Event not found.</p></RoleGate>;

  return (
    <RoleGate allow="player">
      <div className="space-y-3">
        <div className="card">
          <h1 className="text-2xl font-semibold">{event.name}</h1>
          <p className="mt-2 text-sm">Format: {event.scoringMethod} · Type: {event.eventType}</p>
          <p className="text-sm">Tee: {tee?.name ?? 'N/A'}</p>
          <p className="mt-2 text-sm text-slate-700">Rules: {event.rulesText}</p>
          <p className="mt-2 text-sm">Team Assignment: {team?.name ?? 'No team assigned'}</p>
        </div>
      </div>
    </RoleGate>
  );
}
