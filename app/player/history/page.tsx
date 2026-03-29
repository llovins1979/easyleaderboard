'use client';

import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function PlayerHistoryPage() {
  const { currentUser, state } = useAppState();
  const rows = state.eventHistory.filter((r) => r.playerId === currentUser?.playerId);
  const hcpRows = state.handicapHistory.filter((h) => h.playerId === currentUser?.playerId);

  return (
    <RoleGate allow="player">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">My History</h1>
        <div className="card overflow-x-auto">
          <h2 className="font-semibold">Event Results</h2>
          <table className="mt-2 min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Format</th>
                <th className="py-2 text-left">Gross</th>
                <th className="py-2 text-left">Net</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2">{r.date}</td>
                  <td className="py-2">{r.scoringFormat}</td>
                  <td className="py-2">{r.grossScore}</td>
                  <td className="py-2">{r.netScore ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h2 className="font-semibold">Handicap Records</h2>
          <ul className="mt-2 text-sm">
            {hcpRows.map((h) => (
              <li key={h.id}>
                {h.date}: Index {h.handicapIndex} (Gross {h.grossScore}, Net {h.netScore ?? '-'})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RoleGate>
  );
}
