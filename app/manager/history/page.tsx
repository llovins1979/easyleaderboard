'use client';

import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function ManagerHistoryPage() {
  const { state } = useAppState();

  return (
    <RoleGate allow="manager">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Event & Player History</h1>
        <div className="card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Player</th>
                <th className="py-2 text-left">Format</th>
                <th className="py-2 text-left">Gross</th>
                <th className="py-2 text-left">Net</th>
                <th className="py-2 text-left">Event</th>
              </tr>
            </thead>
            <tbody>
              {state.eventHistory.map((h) => (
                <tr key={h.id} className="border-b">
                  <td className="py-2">{h.date}</td>
                  <td className="py-2">{h.playerName}</td>
                  <td className="py-2">{h.scoringFormat}</td>
                  <td className="py-2">{h.grossScore}</td>
                  <td className="py-2">{h.netScore ?? '-'}</td>
                  <td className="py-2">{h.eventId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGate>
  );
}
