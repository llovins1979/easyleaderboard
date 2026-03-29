'use client';

import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function ManagerPlayersPage() {
  const { state } = useAppState();

  return (
    <RoleGate allow="manager">
      <div className="card overflow-x-auto">
        <h1 className="text-2xl font-semibold">Player Management</h1>
        <table className="mt-3 min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Player</th>
              <th className="py-2 text-left">Handicap</th>
              <th className="py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.players.map((p) => {
              const user = state.users.find((u) => u.playerId === p.id);
              return (
                <tr key={p.id} className="border-b">
                  <td className="py-2">{user?.name ?? p.id}</td>
                  <td className="py-2">{p.handicapIndex}</td>
                  <td className="py-2">{p.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </RoleGate>
  );
}
