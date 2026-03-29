import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: 'Supabase is not configured.' }, { status: 400 });
  }

  const body = await req.json();
  const {
    name,
    eventId,
    buyIn,
    maxPlayers,
    payoutConfig,
    managerUserId
  }: {
    name: string;
    eventId?: string;
    buyIn: number;
    maxPlayers: number;
    payoutConfig: { topN: number; percentages: number[]; tiesPolicy: 'split' | 'carryover' };
    managerUserId: string;
  } = body;

  if (!name || !managerUserId) {
    return NextResponse.json({ message: 'Missing fields.' }, { status: 400 });
  }

  if (maxPlayers > 50) {
    return NextResponse.json({ message: 'Money games are limited to groups of 50 or fewer players.' }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();
  const managerUser = await supabase.from('users').select('*').eq('id', managerUserId).maybeSingle();
  if (!managerUser.data || managerUser.data.role !== 'manager') {
    return NextResponse.json({ message: 'Only managers can create money games.' }, { status: 403 });
  }

  const row = {
    id: randomUUID(),
    event_id: eventId ?? null,
    club_id: managerUser.data.club_id,
    name,
    buy_in: buyIn,
    max_players: maxPlayers,
    payout_config: payoutConfig,
    status: 'open',
    created_by_user_id: managerUserId,
    created_at: new Date().toISOString()
  };

  const insert = await supabase.from('money_games').insert(row).select('*').single();
  if (insert.error || !insert.data) {
    return NextResponse.json({ message: insert.error?.message ?? 'Failed to create money game.' }, { status: 500 });
  }

  return NextResponse.json({ moneyGame: insert.data });
}
