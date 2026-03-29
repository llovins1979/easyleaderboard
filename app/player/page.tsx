'use client';

import Link from 'next/link';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function PlayerDashboardPage() {
  const { currentUser, state } = useAppState();
  const myPlayerId = currentUser?.playerId;
  const myEvents = state.events.filter((e) => myPlayerId && e.playerIds.includes(myPlayerId));

  return (
    <RoleGate allow="player">
      <div className="space-y-4">
        <div className="card">
          <h1 className="text-2xl font-semibold">Player Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Join events, enter scores, and track your performance.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {myEvents.map((event) => (
            <div key={event.id} className="card">
              <h2 className="font-semibold">{event.name}</h2>
              <p className="text-sm text-slate-600">{event.date} · {event.scoringMethod}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                <Link href={`/player/events/${event.id}/score-entry`} className="rounded bg-brand-700 px-3 py-1 text-white">
                  Enter Score
                </Link>
                <Link href={`/player/events/${event.id}/leaderboard`} className="rounded border px-3 py-1">
                  Leaderboard
                </Link>
                <Link href={`/player/events/${event.id}/details`} className="rounded border px-3 py-1">
                  Event Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGate>
  );
}
