import { NextResponse } from 'next/server';
import { computeLeaderboard } from '@/lib/scoring';
import { loadAppState } from '@/lib/supabase/state';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const { state } = await loadAppState();
  const leaderboard = computeLeaderboard(state, eventId);
  return NextResponse.json({ eventId, generatedAt: new Date().toISOString(), entries: leaderboard });
}
