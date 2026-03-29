'use client';

import { useMemo } from 'react';
import { useAppState } from '@/components/app-state';

export function LeaderboardTable({ eventId }: { eventId: string }) {
  const { leaderboardForEvent, state } = useAppState();
  const event = state.events.find((e) => e.id === eventId);
  const rows = useMemo(() => leaderboardForEvent(eventId), [leaderboardForEvent, eventId]);

  if (!event) return <p>Event not found.</p>;

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left">Pos</th>
            <th className="px-3 py-2 text-left">Player</th>
            <th className="px-3 py-2 text-left">Thru</th>
            <th className="px-3 py-2 text-left">Gross</th>
            <th className="px-3 py-2 text-left">Net</th>
            <th className="px-3 py-2 text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.playerId} className="border-t">
              <td className="px-3 py-2">{r.position}</td>
              <td className="px-3 py-2">{r.playerName}</td>
              <td className="px-3 py-2">{r.thru}</td>
              <td className="px-3 py-2">{r.gross}</td>
              <td className="px-3 py-2">{r.net ?? '-'}</td>
              <td className="px-3 py-2">{r.points ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
