'use client';

import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function PlayerNotificationsPage() {
  const { state } = useAppState();

  return (
    <RoleGate allow="player">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {state.notifications.map((n) => (
          <div key={n.id} className="card">
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-slate-600">{n.body}</p>
            <p className="mt-2 text-xs text-slate-500">Delivery: {n.providerStatus}</p>
          </div>
        ))}
      </div>
    </RoleGate>
  );
}
