'use client';

import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function ManagerGroupsPage() {
  const { state } = useAppState();

  return (
    <RoleGate allow="manager">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Groups / Flights / Pods</h1>
        {state.playerGroups.map((group) => (
          <div key={group.id} className="card">
            <h2 className="font-semibold">{group.name}</h2>
            <p className="text-sm text-slate-600">Tee time: {group.teeTime ?? 'N/A'}</p>
            <ul className="mt-2 text-sm">
              {group.playerIds.map((pid) => {
                const u = state.users.find((user) => user.playerId === pid);
                return <li key={pid}>{u?.name ?? pid}</li>;
              })}
            </ul>
          </div>
        ))}
      </div>
    </RoleGate>
  );
}
