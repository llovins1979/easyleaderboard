'use client';

import { useParams } from 'next/navigation';
import { RoleGate } from '@/components/role-gate';
import { LeaderboardTable } from '@/components/leaderboard-table';

export default function ManagerLeaderboardPage() {
  const { eventId } = useParams<{ eventId: string }>();

  return (
    <RoleGate allow="manager">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Leaderboard Management</h1>
        <LeaderboardTable eventId={eventId} />
      </div>
    </RoleGate>
  );
}
