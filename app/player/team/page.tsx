'use client';

import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function PlayerTeamPage() {
  const { currentUser, state } = useAppState();
  const membership = state.teamMemberships.find((m) => m.playerId === currentUser?.playerId);
  const team = state.teams.find((t) => t.id === membership?.teamId);

  return (
    <RoleGate allow="player">
      <div className="card">
        <h1 className="text-2xl font-semibold">My Team</h1>
        <p className="mt-2 text-sm">{team ? `Assigned to ${team.name}` : 'No team currently assigned.'}</p>
      </div>
    </RoleGate>
  );
}
