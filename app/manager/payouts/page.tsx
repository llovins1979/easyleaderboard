'use client';

import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function ManagerPayoutsPage() {
  const { state } = useAppState();

  return (
    <RoleGate allow="manager">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Payout & Winner Rules</h1>
        {state.scoringRules.map((rule) => (
          <div key={rule.id} className="card">
            <h2 className="font-semibold">Event {rule.eventId}</h2>
            <p className="text-sm">Winner Top N: {rule.winnerConfig.topN}</p>
            <p className="text-sm">Ties: {rule.winnerConfig.tiesPolicy}</p>
            <p className="text-sm">Categories: {rule.winnerConfig.categories.join(', ')}</p>
            <p className="mt-2 text-sm">Skins Enabled: {rule.skinsConfig.enabled ? 'Yes' : 'No'}</p>
            <p className="text-sm">Skins Mode: {rule.skinsConfig.grossOrNet}</p>
          </div>
        ))}
      </div>
    </RoleGate>
  );
}
