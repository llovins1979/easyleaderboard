'use client';

import { useState } from 'react';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function ManagerPlayersPage() {
  const { state, updateEventPlayerAssignment } = useAppState();
  const [selectedEventId, setSelectedEventId] = useState(state.events[0]?.id ?? '');
  const selectedEvent = state.events.find((event) => event.id === selectedEventId);

  return (
    <RoleGate allow="manager">      
      <div className="space-y-4">
        <div className="card">
          <h1 className="text-2xl font-semibold">Player Management</h1>
          <p className="mt-2 text-sm text-slate-600">
            Managers can add/remove players in each event roster.
          </p>
          <label className="mt-3 block text-sm">
            Select Event
            <select
              className="mt-1 w-full rounded border px-3 py-2"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              {state.events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} ({event.eventType})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="card overflow-x-auto">
          <table className="mt-1 min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Player</th>
                <th className="py-2 text-left">Handicap</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">In Event</th>
              </tr>
            </thead>
            <tbody>
              {state.players.map((p) => {
                const user = state.users.find((u) => u.playerId === p.id);
                const isInEvent = selectedEvent?.playerIds.includes(p.id) ?? false;
                return (
                  <tr key={p.id} className="border-b">
                    <td className="py-2">{user?.name ?? p.id}</td>
                    <td className="py-2">{p.handicapIndex}</td>
                    <td className="py-2">{p.isActive ? 'Active' : 'Inactive'}</td>
                    <td className="py-2">
                      <button
                        className={`rounded px-3 py-1 text-white ${isInEvent ? 'bg-red-600' : 'bg-brand-700'}`}
                        onClick={() => {
                          if (!selectedEventId) return;
                          void updateEventPlayerAssignment(selectedEventId, p.id, !isInEvent);
                        }}
                      >
                        {isInEvent ? 'Remove' : 'Add'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </RoleGate>
  );
}
