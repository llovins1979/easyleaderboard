'use client';

import { useParams } from 'next/navigation';
import { LeaderboardTable } from '@/components/leaderboard-table';
import { RoleGate } from '@/components/role-gate';

export default function PlayerEventLeaderboardPage() {
  const { eventId } = useParams<{ eventId: string }>();
  return (
    <RoleGate allow="player">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Live Leaderboard</h1>
        <LeaderboardTable eventId={eventId} />
      </div>
    </RoleGate>
  );
}
