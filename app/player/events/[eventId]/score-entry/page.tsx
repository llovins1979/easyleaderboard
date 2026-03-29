'use client';

import { useParams } from 'next/navigation';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function ScoreEntryPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const { state, currentUser, updateHoleScore } = useAppState();

  const event = state.events.find((e) => e.id === eventId);
  const scorecard = state.scorecards.find(
    (s) => s.eventId === eventId && currentUser?.playerId && s.playerId === currentUser.playerId
  );

  if (!event || !scorecard) {
    return <RoleGate allow="player"><p>Event scorecard not found.</p></RoleGate>;
  }

  return (
    <RoleGate allow="player">
      <div className="space-y-4">
        <div className="card">
          <h1 className="text-2xl font-semibold">Score Entry · {event.name}</h1>
          <p className="text-sm text-slate-600">Players can edit only their own scores.</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {scorecard.holeScores.map((value, idx) => (
            <div key={idx} className="card p-3">
              <label className="block text-xs uppercase text-slate-500">Hole {idx + 1}</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={15}
                  defaultValue={value || ''}
                  className="w-20 rounded border px-2 py-1"
                  onBlur={(e) => {
                    const parsed = Number(e.target.value);
                    if (!Number.isFinite(parsed) || parsed < 1) return;
                    updateHoleScore({
                      eventId,
                      playerId: scorecard.playerId,
                      holeIndex: idx,
                      score: parsed,
                      reason: 'Player self-entry update'
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGate>
  );
}
