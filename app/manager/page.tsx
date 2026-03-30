'use client';

import Link from 'next/link';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function ManagerDashboardPage() {
  const { state } = useAppState();
  const allEvents = [...state.events].sort((a, b) => b.date.localeCompare(a.date));
  const individualEvents = allEvents.filter((e) => e.eventType === 'individual');
  const teamEvents = allEvents.filter((e) => e.eventType === 'team');

  const renderEventCard = (event: (typeof allEvents)[number]) => (
    <div key={event.id} className="card">
      <h2 className="font-semibold">{event.name}</h2>
      <p className="text-sm text-slate-600">
        {event.date} · {event.scoringMethod} · Status: {event.status}
      </p>
      <div className="mt-3 flex gap-2 text-sm">
        <Link href={`/manager/events/${event.id}/control-room`} className="rounded bg-brand-700 px-3 py-1 text-white">
          Control Room
        </Link>
        <Link href={`/manager/leaderboards/${event.id}`} className="rounded border px-3 py-1">
          Leaderboard
        </Link>
      </div>
    </div>
  );

  return (
    <RoleGate allow="manager">
      <div className="space-y-4">
        <div className="card">
          <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Live scoring operations, event setup, notifications, payouts, and team generation.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Individual Play Events</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {individualEvents.map(renderEventCard)}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Team Play Events</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {teamEvents.map(renderEventCard)}
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
