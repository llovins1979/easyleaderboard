'use client';

import { FormEvent, useState } from 'react';
import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function ManagerMoneyGamesPage() {
  const { state, createMoneyGame } = useAppState();
  const [name, setName] = useState('');
  const [eventId, setEventId] = useState(state.events[0]?.id ?? '');
  const [buyIn, setBuyIn] = useState('20');
  const [maxPlayers, setMaxPlayers] = useState('16');
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const result = await createMoneyGame({
      name,
      eventId: eventId || undefined,
      buyIn: Number(buyIn),
      maxPlayers: Number(maxPlayers),
      payoutConfig: { topN: 3, percentages: [50, 30, 20], tiesPolicy: 'split' }
    });

    setMessage(result.message);
    if (result.ok) {
      setName('');
    }
  };

  return (
    <RoleGate allow="manager">
      <div className="space-y-4">
        <div className="card max-w-2xl">
          <h1 className="text-2xl font-semibold">Money Games (Small Groups)</h1>
          <p className="text-sm text-slate-600">Create side games with strict participant cap of 50 players.</p>
          <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
            <input className="rounded border px-3 py-2" placeholder="Game name" value={name} onChange={(e) => setName(e.target.value)} required />
            <label className="text-sm">
              Event (optional)
              <select className="mt-1 w-full rounded border px-3 py-2" value={eventId} onChange={(e) => setEventId(e.target.value)}>
                <option value="">No event</option>
                {state.events.map((event) => (
                  <option key={event.id} value={event.id}>{event.name}</option>
                ))}
              </select>
            </label>
            <input className="rounded border px-3 py-2" type="number" min="0" step="0.01" placeholder="Buy-in" value={buyIn} onChange={(e) => setBuyIn(e.target.value)} required />
            <input className="rounded border px-3 py-2" type="number" min="2" max="50" placeholder="Max players (<=50)" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} required />
            <button className="rounded bg-brand-700 px-3 py-2 text-white" type="submit">Create Money Game</button>
          </form>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>

        <div className="space-y-2">
          {state.moneyGames.map((game) => {
            const entries = state.moneyGameEntries.filter((entry) => entry.moneyGameId === game.id);
            const pot = entries.length * game.buyIn;
            return (
              <div className="card" key={game.id}>
                <h2 className="font-semibold">{game.name}</h2>
                <p className="text-sm text-slate-600">
                  {entries.length}/{game.maxPlayers} players · Pot ${pot.toFixed(2)} · Status {game.status}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </RoleGate>
  );
}
