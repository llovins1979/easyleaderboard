'use client';

import { RoleGate } from '@/components/role-gate';
import { useAppState } from '@/components/app-state';

export default function PlayerMoneyGamesPage() {
  const { state, currentUser, joinMoneyGame } = useAppState();

  const playerId = currentUser?.playerId;

  return (
    <RoleGate allow="player">
      <div className="space-y-4">
        <div className="card">
          <h1 className="text-2xl font-semibold">Money Games</h1>
          <p className="text-sm text-slate-600">Designed for smaller groups. Maximum participants per game: 50.</p>
        </div>

        {state.moneyGames.map((game) => {
          const entries = state.moneyGameEntries.filter((entry) => entry.moneyGameId === game.id);
          const isJoined = entries.some((e) => e.playerId === playerId);
          const pot = entries.length * game.buyIn;

          return (
            <div className="card" key={game.id}>
              <h2 className="font-semibold">{game.name}</h2>
              <p className="text-sm text-slate-600">
                Buy-in ${game.buyIn.toFixed(2)} · Players {entries.length}/{game.maxPlayers} · Pot ${pot.toFixed(2)}
              </p>
              <p className="text-sm text-slate-600">Status: {game.status}</p>
              <button
                disabled={isJoined || game.status !== 'open'}
                className="mt-3 rounded bg-brand-700 px-3 py-1 text-sm text-white disabled:opacity-50"
                onClick={() => void joinMoneyGame(game.id)}
              >
                {isJoined ? 'Joined' : 'Join Money Game'}
              </button>
            </div>
          );
        })}
      </div>
    </RoleGate>
  );
}
