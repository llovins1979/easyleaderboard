'use client';

import { useParams } from 'next/navigation';
import { RoleGate } from '@/components/role-gate';
import { LeaderboardTable } from '@/components/leaderboard-table';
import { useAppState } from '@/components/app-state';

export default function ControlRoomPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { state, updateHoleScore } = useAppState();
  const event = state.events.find((e) => e.id === eventId);
  const cards = state.scorecards.filter((s) => s.eventId === eventId);

  if (!event) return <RoleGate allow="manager"><p>Event not found.</p></RoleGate>;

  return (
    <RoleGate allow="manager">
      <div className="space-y-4">
        <div className="card">
          <h1 className="text-2xl font-semibold">Scoring Control Room · {event.name}</h1>
          <p className="text-sm text-slate-600">Managers can edit any score at any time with audit logs.</p>
        </div>

        <LeaderboardTable eventId={eventId} />

        <div className="card overflow-x-auto">
          <h2 className="font-semibold">Manager Score Overrides</h2>
          <table className="mt-2 min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Player</th>
                <th className="py-2 text-left">Hole 1</th>
                <th className="py-2 text-left">Hole 2</th>
                <th className="py-2 text-left">Hole 3</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => {
                const user = state.users.find((u) => u.playerId === card.playerId);
                return (
                  <tr className="border-b" key={card.id}>
                    <td className="py-2">{user?.name ?? card.playerId}</td>
                    {[0, 1, 2].map((hole) => (
                      <td key={hole} className="py-2">
                        <input
                          type="number"
                          className="w-16 rounded border px-2 py-1"
                          defaultValue={card.holeScores[hole]}
                          onBlur={(e) => {
                            const v = Number(e.target.value);
                            if (!Number.isFinite(v) || v < 1) return;
                            updateHoleScore({
                              eventId,
                              playerId: card.playerId,
                              holeIndex: hole,
                              score: v,
                              reason: 'Manager control room override'
                            });
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2 className="font-semibold">Score Edit Audit Log</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {state.auditLogs.filter((log) => log.eventId === eventId).map((log) => {
              const editor = state.users.find((u) => u.id === log.editorUserId);
              return (
                <li key={log.id}>
                  {log.editedAt}: {editor?.name ?? log.editorUserId} · {log.reason}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </RoleGate>
  );
}
