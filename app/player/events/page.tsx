'use client';

import Link from 'next/link';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function PlayerEventsPage() {
  const { currentUser, state } = useAppState();
  const myEvents = state.events.filter((event) =>
    currentUser?.playerId ? event.playerIds.includes(currentUser.playerId) : false
  );

  return (
    <RoleGate allow="player">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">My Events</h1>
        {myEvents.map((event) => (
          <div key={event.id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold">{event.name}</h2>
                <p className="text-sm text-slate-600">{event.date} · {event.eventType}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <Link href={`/player/events/${event.id}/score-entry`} className="rounded bg-brand-700 px-3 py-1 text-white">
                  Score Entry
                </Link>
                <Link href={`/player/events/${event.id}/leaderboard`} className="rounded border px-3 py-1">
                  View Board
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </RoleGate>
  );
}
